# accounts/views.py

import math
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.shortcuts import render, redirect
from accounts.forms import ProfileForm
from main.models import Bandname
from .utils import *
from django.contrib.auth.models import User
from django.http import JsonResponse


def Registration(request):

    # Handle form submission
    if request.method == "POST": 
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("/")

    # Set up form if not submitted
    form = UserCreationForm()
    ctxt = {
        "form": form
    }
    return render (request, "registration/signup.html", ctxt)

def ProfanityToggle(request):
    if request.method == "POST": 
        if request.user.is_authenticated:
            user = User.objects.get(pk=request.user.id)
            form = ProfileForm(request.POST)
            if form.is_valid():
                if form.cleaned_data['profanity_filter']:
                    user.profile.profanity_filter = True
                else:
                    user.profile.profanity_filter = False
                user.save()

    return HttpResponse('great')

def ProfileView(request):

    form = ProfileForm
    if request.user.is_authenticated:        
        template = "registration/profile.html"
        ctxt = {
            "user": request.user,
            "profanity_filter": request.user.profile.profanity_filter,
            "form": form
        }
    else:
        return redirect("/")

    return render(request, template, context=ctxt)

def get_rows(request):
    if request.method == "GET":
        print('ORDERING BANDNAME: ', request.GET.get('order[0][dir]'))
        print('ORDERING SCORE:    ', request.GET.get('order[1][dir]'))
        if request.GET.get('order[0][dir]') == 'desc':
            user_submissions = Bandname.objects.filter(username=request.user.username).all().order_by('-bandname')
        if request.GET.get('order[0][dir]') == 'asc':
            user_submissions = Bandname.objects.filter(username=request.user.username).all().order_by('bandname')
        
        if request.GET.get('order[1][dir]') == 'desc':
            user_submissions = Bandname.objects.filter(username=request.user.username).all().order_by('-score')
        if request.GET.get('order[1][dir]') == 'asc':
            user_submissions = Bandname.objects.filter(username=request.user.username).all().order_by('score')
        
        submission_count = user_submissions.count()
        _start = request.GET.get('start')
        _length = request.GET.get('length')
        page = 0
        length = 0
        per_page = 10
        if _start and _length:
            start = int(_start)
            length = int(_length)
            page = math.ceil(start / length) + 1
            per_page = length
            user_submissions = user_submissions[start:start + length]

        data = [{'bandname': bandname.bandname, 'score': bandname.score} for bandname in user_submissions]
        response = {
            "data": data,
            "page": page,
            "per_page": per_page,
            "recordsTotal": submission_count,
            "recordsFiltered": submission_count,
        }
        return JsonResponse(response)