from asyncio import constants
from ctypes import sizeof
from distutils.command.clean import clean
#from types import NoneType
from django.shortcuts import render, redirect
import json
from django.http import HttpResponse
from .models import Bandname
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname, Vote
from django.contrib.auth import login
from django.contrib.auth.models import User
from profanity.extras import ProfanityFilter
from .readInBandnames import readInList
import random

def index(request):
    form = CreateBandname()
    bandnames = []
    collection_len = Bandname.objects.count()

    for x in range(collection_len):
        bandnames.append(Bandname.objects.all()[random.randint(0, collection_len-1)])
        if len(bandnames) == 11:
            break

    cleaned_list = []
    voted_bandnames_objs = []
    profanity_filter = True

    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    if request.user.is_authenticated:

        user = User.objects.get(pk=request.user.id)
        profanity_filter = user.profile.profanity_filter
        voted_bandnames = user.profile.voted_bandnames

        if (voted_bandnames is not None):
            for voted_bandname in voted_bandnames:
                voted_bandnames_objs.append(Bandname.objects.get(bandname=voted_bandname))

    if len(cleaned_list) == 0:
        cleaned_list.append("NO BANDNAMES AVAILABLE")

    voted_names_dict = {}
    for name in voted_bandnames_objs:
        voted_names_dict[name.bandname] = name.score

    ctxt = {
            "title"     : "Submission Page",
            "profanity_filter": profanity_filter,
            "bandnames": cleaned_list,
            "voted_bandnames": voted_bandnames_objs,
            "count": collection_len,
            "form"      : form
           }

    return render(request, "../templates/bnSubmission/submission.html", context=ctxt)

def create(request):

    if request.method == 'POST':
        if request.user.is_authenticated:

            form = CreateBandname(request.POST)
            if form.is_valid():

                if form.cleaned_data['bandname'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                # Return a failed response if bandname exists in DB already 
                try:
                    if (Bandname.objects.get(bandname = form.cleaned_data['bandname'])):
                        json_response = { 'response_msg': 'Bandname already exists' }
                        return JsonResponse(json_response, safe = False)  

                # If the bandname does not exist, create it
                except Bandname.DoesNotExist:

                    new_bandname_str = form.cleaned_data['bandname']
                    new_bandname = Bandname(bandname=new_bandname_str,
                                            username=request.user.username,
                                            score=0)
                    new_bandname.save()
                    json_response = {}
                    json_response['bandname_json'] = {
                                                 'bandname': new_bandname_str,
                                                 'username': request.user.username,
                                                 'score': 0
                                                }
                    json_response['response_msg'] = 'Bandname created successfully!'
                    return JsonResponse(json_response, safe = False)
            else:
                json_response = { 'response_msg': 'Check console for error' }
                return JsonResponse(json_response, safe = False)
        else:
            form = CreateBandname(request.POST)
            if form.is_valid():

                if form.cleaned_data['bandname'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                # Return a failed response if bandname exists in DB already 
                try:
                    if (Bandname.objects.get(bandname = form.cleaned_data['bandname'])):
                        json_response = { 'response_msg': 'Bandname already exists' }
                        return JsonResponse(json_response, safe = False)  

                # If the bandname does not exist, create it
                except Bandname.DoesNotExist:

                    new_bandname_str = form.cleaned_data['bandname']
                    new_bandname = Bandname(bandname=new_bandname_str,
                                            username="Anonymous",
                                            score=0)
                    new_bandname.save()
                    json_response = {}
                    json_response['bandname_json'] = {
                                                 'bandname': new_bandname_str,
                                                 'username': "Anonymous",
                                                 'score': 0
                                                }
                    json_response['response_msg'] = 'Bandname created successfully!'
                    return JsonResponse(json_response, safe = False)
            else:
                json_response = { 'response_msg': 'Check console for error' }
                return JsonResponse(json_response, safe = False)


def vote(request):
    
    if request.method == "POST":
        if request.user.is_authenticated:

            user = User.objects.get(pk=request.user.id)
            bandname = Bandname.objects.get(bandname=request.POST['bandname'])
            filter = ProfanityFilter()

            # User has not voted on any bandnames
            if user.profile.voted_bandnames is None:
                
                if request.POST['val'] == "up":
                    bandname.score += 1
                else:
                    bandname.score -= 1
                
                # Assignment to voted_bandnames json object (since at this point it's None)
                user.profile.voted_bandnames = {bandname.bandname: "voted"}

                bandname.save()
                user.save()

                if request.POST['val'] == 'up':
                    json_response = { 'vote-msg': 'Voted up'}
                else:
                    json_response = { 'vote-msg': 'Voted down'}

                if (user.profile.profanity_filter):
                    json_response['bandname_json'] = {
                                                    'bandname': filter.censor(bandname.bandname),
                                                    'username': bandname.username,
                                                    'score': bandname.score
                                                    }
                else:
                    json_response['bandname_json'] = {
                                                    'bandname': bandname.bandname,
                                                    'username': bandname.username,
                                                    'score': bandname.score
                                                    }
                
                return JsonResponse(json_response)  

            # Bandname does not exist in user's voted bandnames
            elif not bandname.bandname in user.profile.voted_bandnames:
                
                if request.POST['val'] == "up":
                    bandname.score += 1
                else:
                    bandname.score -= 1
                
                # Set new key
                user.profile.voted_bandnames[bandname.bandname] = "voted"

                # Save the bandname and the user
                bandname.save()
                user.save()

                if request.POST['val'] == 'up':
                    json_response = { 'vote-msg': 'Voted up'}
                else:
                    json_response = { 'vote-msg': 'Voted down'}

                if (user.profile.profanity_filter):
                    json_response['bandname_json'] = {
                                                    'bandname': filter.censor(bandname.bandname),
                                                    'username': bandname.username,
                                                    'score': bandname.score
                                                    }
                else:
                    json_response['bandname_json'] = {
                                                    'bandname': bandname.bandname,
                                                    'username': bandname.username,
                                                    'score': bandname.score
                                                    }
                print(json_response)
                
                return JsonResponse(json_response) 
            
            json_response = { 'vote-msg': 'Already voted' }
            return JsonResponse(json_response, safe = False) 
        json_response = { 'vote-msg': 'Not logged in' }
        return JsonResponse(json_response, safe = False) 


def BatchSubmit(request):
    form = CreateBatchBandname()
    ctxt = {
        "title": "Batch Submission Page",
        "form": form
    }
    return render(request, "../templates/bnSubmission/batch_submission.html", context=ctxt)

def BatchCreate(request):

    # Ensure the request method is POST and the user is logged in
    if request.method == 'POST':
        if request.user.is_authenticated:
            # Get the data from the submitted form 
            form = CreateBatchBandname(request.POST)

            # Ensure the form is valid (django function)
            if form.is_valid():

                # Ensure the form is not empty, otherwise return error
                if form.cleaned_data['bandnames'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                # etc... 
                batchList = readInList(form.cleaned_data['bandnames'], form.cleaned_data['numbered'], form.cleaned_data['dated'])
                for bandname in batchList:
                    print(bandname)
                    new_bandname = Bandname(bandname=bandname,
                                            username=request.user.username,
                                            score=0)
                    new_bandname.save()

                json_response = {"response_msg":"These bandnames are delicious"}
                return JsonResponse(json_response, safe = False)

        return HttpResponse("Please login to submit a batch")

    return HttpResponse("must be POST method")
