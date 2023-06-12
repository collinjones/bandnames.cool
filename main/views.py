from unicodedata import name
from django.shortcuts import render
from .models import Bandname
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth import login
from django.contrib.auth.models import User
from .utils import *
from .form_functions import *
from django.utils.timezone import now

# Sets up and renders the submission page
def index(request):
    
    form = CreateBandname()
    bandnames = []
    collection_len = Bandname.objects.count()
    cleaned_list = []
    profanity_filter = True

    # Get bandnames for the wheel
    if collection_len != 0:
        bandnames = get_bandnames(collection_len)

    for bandname in bandnames:
        cleaned_list.append((bandname.bandname, censor_bandname(bandname.bandname)))

    if request.user.is_authenticated:

        user = User.objects.get(pk=request.user.id)
        user.profile.last_ip_address = get_client_ip(request)
        user.profile.last_logged_in = now().strftime("%Y-%m-%d")
        user.save()
        profanity_filter = user.profile.profanity_filter

    # Is database empty?
    if collection_len == 0:
        cleaned_list.append(('No Bandnames Available', 'No Bandnames Available'))

    print(cleaned_list)

    ctxt = {
        "title"     : "Bandnames.cool",
        "profanity_filter": profanity_filter,
        "bandnames": cleaned_list,
        "count": collection_len,
        "form"      : form
    }

    return render(request, "../templates/main/submission.html", context=ctxt)

def bandalytics(request):
    template = "../templates/main/bandalytics.html"
    ctxt = {
        "title": "Bandnames.cool | Bandalytics",
    }
    return render(request, template, context=ctxt)

# Sets up and renders the FAQ page
def faq(request):
    template = "../templates/main/faq.html"
    ctxt = {
        "title": "Bandnames.cool | FAQ"
    }
    return render(request, template, context=ctxt)

# Sets up and renders the batch submission page
def batch_submit(request):
    form = CreateBatchBandname()
    ctxt = {
        "title": "Bandnames.cool | Batch Submission",
        "form": form
    }
    return render(request, "../templates/main/batch_submission.html", context=ctxt)
