# accounts/views.py

from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.shortcuts import render, redirect
from accounts.forms import ProfileForm
from main.models import Bandname
from .utils import *
from django.contrib.auth.models import User


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

        user_bandnames = Bandname.objects.filter(username=request.user.username).order_by('-score').values()
        user = User.objects.get(pk=request.user.id)
        
        set_user_score(user, user_bandnames)
        
        template = "registration/profile.html"
        ctxt = {
            "user": request.user,
            "user_bandnames": user_bandnames,
            "profanity_filter": request.user.profile.profanity_filter,
            "form": form
        }
    else:
        return redirect("/")

    return render(request, template, context=ctxt)
