from django.shortcuts import render
from django.http import HttpResponse
from .models import Bandname

def create(request):
    print(request.method)
    # bandname = request.POST['bandname']
    # username = request.POST['username']
    # success = 'The bandname "' + bandname + '" submitted successfully by ' + username
    # return HttpResponse(success)
    # if request.method == 'POST':

    #     Bandname.objects.all().delete()

    
    #     new_bandname = Bandname(bandname=bandname,
    #                             upvotes=0,
    #                             downvotes=0,
    #                             username=username)
    #     new_bandname.save()
    #     success = 'The bandname "' + bandname + '" submitted successfully by ' + username
    #     return HttpResponse(success)


def index(request):
    ctxt = {"title" : "Submission Page"}
    return render(request, "../templates/Bandnames/submission.html", context=ctxt)