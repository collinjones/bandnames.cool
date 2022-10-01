from unicodedata import name
from django.shortcuts import render
from .models import Bandname
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth import login
from django.contrib.auth.models import User
from .utils import *
from .form_functions import *
import datetime

# for every single bandname in database, 
# go through every single voted_bandnames list and remove entries that 
# don't exist anymore.


def deleted_bandname_cleanup():
    bandnames = Bandname.objects.all()
    cleaned_list = []
    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    users = User.objects.all()
    for user in users:
        voted_bandnames = user.profile.voted_bandnames
        if voted_bandnames:
            if not isinstance(voted_bandnames, str):
                for key in voted_bandnames.copy():
                    if key not in cleaned_list:
                        del user.profile.voted_bandnames[key]
        user.save()

def add_vote_obj():
    users = User.objects.all()
    for user in users:
        voted_names = user.profile.voted_bandnames
        if voted_names:
            if not isinstance(voted_names, str):
                for name in voted_names:
                    try:
                        bandname = Bandname.objects.get(bandname = name)
                        print("Adding ", bandname.bandname, " to user: ", user.id)
                        user.profile.voted_bandnames_list.add(bandname)
                    except:
                        pass

# Sets up and renders the submission page
def index(request):
    
    form = CreateBandname()
    bandnames = []
    collection_len = Bandname.objects.count()
    cleaned_list = []
    profanity_filter = True

    # Get 11 bandnames for the wheel
    bandnames = get_bandnames(collection_len)

    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.id)
        profanity_filter = user.profile.profanity_filter

    # Is database empty?
    if len(cleaned_list) == 0:
        cleaned_list.append("NO BANDNAMES AVAILABLE")

    ctxt = {
        "title"     : "Submission Page",
        "profanity_filter": profanity_filter,
        "bandnames": cleaned_list,
        "count": collection_len,
        "form"      : form
    }

    return render(request, "../templates/main/submission.html", context=ctxt)

# Sets up and renders the FAQ page
def faq(request):
    template = "../templates/main/faq.html"
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
    return render(request, "../templates/main/batch_submission.html", context=ctxt)
