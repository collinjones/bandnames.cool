from django.shortcuts import render
from .models import Bandname
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth import login
from django.contrib.auth.models import User
from .utils import *
from .form_functions import *

# Sets up and renders the submission page
def index(request):
    
    form = CreateBandname()
    bandnames = []
    collection_len = Bandname.objects.count()
    users_count = User.objects.count()
    cleaned_list = []
    voted_bandnames_objs = []
    profanity_filter = True

    # Get 11 bandnames for the wheel
    bandnames = get_bandnames(collection_len)

    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    if request.user.is_authenticated:

        user = User.objects.get(pk=request.user.id)
        profanity_filter = user.profile.profanity_filter
        voted_bandnames = user.profile.voted_bandnames

        # If user has voted on atleast one bandname, search for each bandname in the db
        if voted_bandnames is not None:
            for voted_bandname in voted_bandnames:

                # If I delete any names from the database that someone has voted on,
                #   This try/except statement will prevent an error when looking it up

                # Only append bandnames that are in the database, otherwise skip it. 
                try:
                    voted_bandnames_objs.append(Bandname.objects.get(bandname=voted_bandname))
                except:
                    pass
        
        voted_bandnames_objs.sort(key=lambda x: x.score, reverse=True)

    # Is database empty?
    if len(cleaned_list) == 0:
        cleaned_list.append("NO BANDNAMES AVAILABLE")

    print(f'{users_count = }')

    ctxt = {
        "title"     : "Submission Page",
        "profanity_filter": profanity_filter,
        "bandnames": cleaned_list,
        "voted_bandnames": voted_bandnames_objs,
        "count": collection_len,
        "form"      : form
    }

    return render(request, "../templates/bnSubmission/submission.html", context=ctxt)

# Sets up and renders the FAQ page
def faq(request):
    template = "../templates/bnSubmission/faq.html"
    ctxt = {
        "title": "FAQ"
    }
    return render(request, template, context=ctxt)

# Sets up and renders the batch submission page
def batch_submit(request):
    form = CreateBatchBandname()
    ctxt = {
        "title": "Batch Submission Page",
        "form": form
    }
    return render(request, "../templates/bnSubmission/batch_submission.html", context=ctxt)
