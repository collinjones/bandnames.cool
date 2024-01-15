from django.shortcuts import render
from .models import Bandname
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth.models import User
from .utils import *
from .form_functions import *
from django.utils import timezone
from django.shortcuts import redirect

# Sets up and renders the submission page
def index(request):
    bandname_submission_form = CreateBandname()
    collection_len = Bandname.objects.count()
    profanity_filter = True
    random_quip = get_random_quip('static/main/quips/bandname_quips.txt')
    bandnames = get_random_bandnames_for_wheel(collection_len)
    censored_bandnames = censor_bandnames(bandnames)
    
    # Sets up homepage if user is authenticated
    if request.user.is_authenticated:
        user = User.objects.get(pk=request.user.id)
        user.profile.last_ip_address = get_client_ip(request)
        user.profile.last_logged_in = timezone.now().strftime("%Y-%m-%d")
        user.save()
        profanity_filter = user.profile.profanity_filter

    # If Database is empty just display no bandnames available
    if collection_len == 0:
        censored_bandnames.append(('No Bandnames Available', 'No Bandnames Available'))

    context = {
        "title": "Bandnames.cool | Home",
        "profanity_filter": profanity_filter,
        "bandnames": censored_bandnames,
        "count": collection_len,
        "form": bandname_submission_form,
        "footer_text": random_quip,
    }
    return render(request, "main/index.html", context=context)

def bandalytics(request):
    return render(request, "main/bandalytics.html", context={"title": "Bandnames.cool | Bandalytics"})

# Sets up and renders the FAQ page
def faq(request):
    return render(request, "main/faq.html", context={"title": "Bandnames.cool | FAQ"})

# Sets up and renders the batch submission page
def batch_submit(request):
    context = {
        "title": "Bandnames.cool | Batch Submission",
        "form": CreateBatchBandname()
    }
    return render(request, "main/batch_submission.html", context=context)

# Refreshes the bandname wheel with new bandnames if .cool was pressed
def refresh_wheel(request):
    print(request.META.get('HTTP_REFERER'))
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