from django.shortcuts import render
from .models import Bandname
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth.models import User
from .utils import *
from .form_functions import *
from django.utils.timezone import now
from django.shortcuts import redirect

# Sets up and renders the submission page
def index(request):
    
    form = CreateBandname()
    bandnames = []
    collection_len = Bandname.objects.count()
    cleaned_list = []
    profanity_filter = True
    
    random_quip = get_random_quip('static/main/quips/bandname_quips.txt')
    bandnames = get_random_bandnames_for_wheel(collection_len)
    cleaned_list = censor_bandnames(bandnames)
    
    # Sets up homepage if user is authenticated
    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.id)
        user.profile.last_ip_address = get_client_ip(request)
        user.profile.last_logged_in = now().strftime("%Y-%m-%d")
        user.save()
        profanity_filter = user.profile.profanity_filter

    # If Database is empty just display no bandnames available
    if collection_len == 0:
        cleaned_list.append(('No Bandnames Available', 'No Bandnames Available'))

    ctxt = {
        "title"     : "Bandnames.cool | Home",
        "profanity_filter": profanity_filter,
        "bandnames": cleaned_list,
        "count": collection_len,
        "form"      : form,
        "footer_text": random_quip,
    }

    return render(request, "../templates/main/index.html", context=ctxt)

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

# Refreshes the bandname wheel with new bandnames if .cool was pressed
def refresh_wheel(request):

    if request.META.get('HTTP_REFERER') == 'http://127.0.0.1:8000/' or \
    request.META.get('HTTP_REFERER') == 'https://www.bandnames.cool/':
        bandnames = get_random_bandnames_for_wheel(Bandname.objects.count())
        cleaned_list = censor_bandnames(bandnames)
        response = {
            "bandnames": cleaned_list
        }
        return JsonResponse(response)
    else:
        return redirect('/')