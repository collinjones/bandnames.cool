# accounts/views.py

import math
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from accounts.forms import ProfileForm
from main.models import Bandname
from .utils import *
from main.utils import *
from django.contrib.auth.models import User
from django.http import JsonResponse


def Registration(request):

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            print('test')
            new_user = form.save()
            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password1'])
            login(request, new_user)
            return HttpResponseRedirect("/")
        
    # Set up form if not submitted

    form = UserCreationForm()
    ctxt = {
        "form": form,
        "title": "Sign Up",
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
    user_submissions = Bandname.objects.filter(username=request.user).all()
    user = User.objects.get(pk=request.user.id)
        
    if request.user.is_authenticated:        
        template = "registration/profile.html"
        ctxt = {
            "user": request.user,
            "profanity_filter": request.user.profile.profanity_filter,
            "score": set_user_score(user, user_submissions),
            "form": form,
            "title": "Profile",
        }
    else:
        return redirect("/")

    return render(request, template, context=ctxt)

def get_rows(request):
    if request.method == "GET":
        search_query = request.GET.get('search[value]')
        column_id = int(request.GET.get('order[0][column]')) if request.GET.get('order[0][column]') != None \
                                                             else None
        direction = request.GET.get('order[0][dir]') if request.GET.get('order[0][dir]') != None \
                                                     else None
        username = request.user.username 
        user = User.objects.get(pk=request.user.id)

        if column_id == 0 and direction == "desc":
            user_submissions = Bandname.objects.filter(username=username).all().order_by('-bandname')
        if column_id == 0 and direction == "asc":
            user_submissions = Bandname.objects.filter(username=username).all().order_by('bandname')
        
        if column_id == 1 and direction == "desc":
            user_submissions = Bandname.objects.filter(username=username).all().order_by('-score')
        if column_id == 1 and direction == "asc":
            user_submissions = Bandname.objects.filter(username=username).all().order_by('score')
        
        if search_query:
            user_submissions = Bandname.objects.filter(bandname__icontains=search_query, username=username)
            if column_id == 0 and direction == "desc":
                user_submissions = Bandname.objects.filter(bandname__icontains=search_query, username=username).order_by('-bandname')
            if column_id == 0 and direction == "asc":
                user_submissions = Bandname.objects.filter(bandname__icontains=search_query, username=username).order_by('bandname')
            
            if column_id == 1 and direction == "desc":
                user_submissions = Bandname.objects.filter(bandname__icontains=search_query, username=username).order_by('-score')
            if column_id == 1 and direction == "asc":
                user_submissions = Bandname.objects.filter(bandname__icontains=search_query, username=username).order_by('score')

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

            # This has no explanation. Without it, sorting by lowest to highest score 
            #   makes the user_submissions list act wonky. user_submissions[0] is not the start of the list if that makes sense.. 
            for sub in user_submissions:
                pass

            user_submissions = user_submissions[start:start + length]


        data = [{'bandname': censor_bandname(bandname.bandname) if user.profile.profanity_filter else bandname.bandname, 'score': bandname.score} for bandname in user_submissions]
        response = {
            "data": data,
            "page": page,
            "per_page": per_page,
            "recordsTotal": submission_count,
            "recordsFiltered": submission_count,
        }
        return JsonResponse(response)