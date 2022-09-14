# accounts/views.py

from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from accounts.forms import ProfileForm
from .models import Profile
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
        print(request.user.profile.profanity_filter)
        template = "registration/profile.html"
        ctxt = {
            "user": request.user,
            "form": form
        }
    else:
        template = "registration/signup.html"
        ctxt = {
            
        }
    return render(request, template, context=ctxt)
