from django.shortcuts import render
from django.http import HttpResponse
from .models import Bandname

def create(request):
    if request.method == 'POST':

        Bandname.objects.all().delete()

        bandname = request.POST['bandname']
        username = request.POST['username']
        new_bandname = Bandname(bandname=bandname,
                                upvotes=0,
                                downvotes=0,
                                username=username)
        new_bandname.save()
        success = 'The bandname ' + bandname + ' !submitted successfully by ' + username
        return HttpResponse(success)


def index(request):
    return render(request, "../templates/Bandnames/index.html")