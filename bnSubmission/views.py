from ctypes import sizeof
from django.shortcuts import render, redirect
import json
from django.http import HttpResponse
from .models import Bandname
from django.http import JsonResponse
from .forms import CreateBandname
from django.contrib.auth import login
from django.contrib import messages
from django.core import serializers

def refreshNames(request):
    if request.method == 'GET':

        # Return the last bandname added to DB
        serealized = list(Bandname.objects.values())
        return JsonResponse(serealized, safe = False)

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
                    json_response['bandname_json'] = {
                                                 'bandname': new_bandname_str,
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
                   
def index(request):
    form = CreateBandname()
    bandnames = Bandname.objects.all()
    bandnames_json = serializers.serialize("json", Bandname.objects.all())
    ctxt = {
            "title"     : "Submission Page",
            "bandnames_reversed" : reversed(Bandname.objects.all()),
            "bandnames": list(bandnames),
            "form"      : form
            }
    return render(request, "../templates/bnSubmission/submission.html", context=ctxt)