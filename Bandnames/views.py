from unicodedata import name
from django.shortcuts import render
from django.http import HttpResponse
from .models import Bandname
from django.core.exceptions import ObjectDoesNotExist

def create(request):
    
    if request.method == 'POST':

        bn = request.POST['bandname']

        # Return a failed response if bandname exists in DB already 
        try:
            if (Bandname.objects.get(bandname = bn)):
                failed = "Name exists already!"
                return HttpResponse(failed)  

        # If the bandname does not exist, create it
        except Bandname.DoesNotExist:
            username = request.POST['username']
            success = 'The bandname "' + bn + '" submitted successfully by ' + username
            # Bandname.objects.all().delete()

            new_bandname = Bandname(bandname=bn,
                                    upvotes=0,
                                    downvotes=0,
                                    username=username)
            new_bandname.save()
            success = 'The bandname "' + bn + '" submitted successfully by ' + username
            return HttpResponse(success)
            
        
            

def index(request):
    ctxt = {"title" : "Submission Page"}
    return render(request, "../templates/Bandnames/submission.html", context=ctxt)