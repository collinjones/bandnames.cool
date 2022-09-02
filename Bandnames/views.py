from unicodedata import name
from django.shortcuts import render
import json
from django.http import HttpResponse
from .models import Bandname
from django.http import JsonResponse
from django.core import serializers

def refreshNames(request):
    if request.method == 'GET':

        # Return the last bandname added to DB
        all_bands = Bandname.objects.all()
        serealized = list(Bandname.objects.values())
        return JsonResponse(serealized, safe = False)

def create(request):
    
    if request.method == 'POST':

        bn = request.POST['bandname']
        un = request.POST['username']

        # Return a failed response if bandname exists in DB already 
        try:
            if (bn == ""):
                return HttpResponse("Bandname required")
            if (un == ""):
                return HttpResponse("Username required")
            if (Bandname.objects.get(bandname = bn)):
                return HttpResponse("Bandname '" + bn + "' exists already")  

        # If the bandname does not exist, create it
        except Bandname.DoesNotExist:
            #Bandname.objects.all().delete()
            new_bandname = Bandname(bandname=bn,
                                    upvotes=0,
                                    downvotes=0,
                                    username=un)
            new_bandname.save()
            success = 'The bandname "' + bn + '" submitted successfully by ' + un
            return HttpResponse(success)
            
        
            

def index(request):
    all_bandnames = Bandname.objects.all()
    ctxt = {"title" : "Submission Page",
            "bandnames": all_bandnames}
    return render(request, "../templates/Bandnames/submission.html", context=ctxt)