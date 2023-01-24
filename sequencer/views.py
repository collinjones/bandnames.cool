from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    if (request.device['is_mobile']):
        return render(request, "../templates/sequencer/mobile.html")
    else:
        return render(request, "../templates/sequencer/base.html")