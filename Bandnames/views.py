from unicodedata import name
from django.shortcuts import render
from django.http import HttpResponse
from .models import Bandname

def refreshNames(request):
    if request.method == 'GET':

        # Return the last bandname added to DB
        all_bands = Bandname.objects.values_list('bandname', flat=True)
        return HttpResponse(all_bands[len(all_bands)-1])

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