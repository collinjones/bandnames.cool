from asyncio import constants
from ctypes import sizeof
from django.shortcuts import render, redirect
import json
from django.http import HttpResponse
from .models import Bandname
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname, Vote
from django.contrib.auth import login
from django.contrib.auth.models import User
from profanity.extras import ProfanityFilter

def index(request):
    form = CreateBandname()
    bandnames = list(Bandname.objects.all())
    cleaned_list = []
    profanity_filter = True

    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.id)
        profanity_filter = user.profile.profanity_filter

    ctxt = {
            "title"     : "Submission Page",
            "bandnames_reversed" : reversed(bandnames),
            "profanity_filter": profanity_filter,
            "bandnames": cleaned_list,
            "bandname_objs": bandnames,
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

                    # Bandname.objects.all().delete()
                    new_bandname_str = form.cleaned_data['bandname']
                    new_bandname = Bandname(bandname=new_bandname_str,
                                            username=request.user.username,
                                            upvotes=0,
                                            downvotes=0)
                    new_bandname.save()
                    json_response = {}
                    user = User.objects.get(pk=request.user.id)
                    filter = ProfanityFilter()
                    json_response['bandname_json'] = {
                                                 'bandname': filter.censor(new_bandname_str),
                                                 'username':request.user.username,
                                                 'upvotes': 0,
                                                 'downvotes': 0
                                                }
                    return JsonResponse(json_response, safe = False)
            else:
                json_response = { 'response_msg': 'Check console for error' }
                return JsonResponse(json_response, safe = False)
        else:
            json_response = { 'response_msg': 'Must be <a href="/accounts/login/"> logged in </a> to submit a bandname' }
            return JsonResponse(json_response, safe = False)


def vote(request):
    
    if request.method == "POST":
        if request.user.is_authenticated:

            user = User.objects.get(pk=request.user.id)
            bandname = Bandname.objects.get(bandname=request.POST['bandname'])

            if user.profile.voted_bandnames is None:
                print("Voting " + request.POST['val'] + " on bandname: " + \
                    request.POST['bandname'])  
                
                if request.POST['val'] == "up":
                    bandname.upvotes += 1
                else:
                    bandname.downvotes =+ 1
                
                user.profile.voted_bandnames = {bandname.bandname: "voted"}

                bandname.save()
                user.save()
                json_response = { 'vote-msg': 'Voted up' }
                return JsonResponse(json_response, safe = False)  

            elif not bandname.bandname in user.profile.voted_bandnames:

                print("Voting " + request.POST['val'] + " on bandname: " + \
                    request.POST['bandname'])  
                

                if request.POST['val'] == "up":
                    bandname.upvotes += 1
                else:
                    bandname.downvotes =+ 1
                
                user.profile.voted_bandnames = {bandname.bandname: "voted"}

                bandname.save()
                user.save()
                json_response = { 'vote-msg': 'Voted down' }
                return JsonResponse(json_response, safe = False) 
            
            json_response = { 'vote-msg': 'Already voted' }
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

                print(form.cleaned_data['bandnames'])

                # Ensure the form is not empty, otherwise return error
                if form.cleaned_data['bandnames'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                # etc... 

                return HttpResponse("great")