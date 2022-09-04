from django.shortcuts import render
import json
from django.http import HttpResponse
from .models import Bandname, CustomUser
from django.http import JsonResponse
from .forms import CreateBandname

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
                    return HttpResponse("Bandname cannot be empty")

                # Return a failed response if bandname exists in DB already 
                try:
                    if (Bandname.objects.get(bandname = form.cleaned_data['bandname'])):
                        return HttpResponse("Bandname already exists")  

                # If the bandname does not exist, create it
                except Bandname.DoesNotExist:
                    # Bandname.objects.all().delete()
                    new_bandname = Bandname(bandname=form.cleaned_data['bandname'],
                                            username=request.user.username,
                                            upvotes=0,
                                            downvotes=0)
                    new_bandname.save()
                    return HttpResponse("Successfully added '" + form.cleaned_data['bandname']+ "' to database")
            else:
                print(form.errors)
                return HttpResponse("Check console for error")
        else:
             return HttpResponse("Must be logged in to submit a bandname")
        
def index(request):
    all_bandnames = Bandname.objects.all()
    form = CreateBandname()
    ctxt = {
            "title"     : "Submission Page",
            "bandnames" : all_bandnames,
            "form"      : form
            }
    return render(request, "../templates/Bandnames/submission.html", context=ctxt)