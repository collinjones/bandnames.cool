# registration/views.py

import math
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.contrib import auth
from django.shortcuts import render, redirect
from main.models import Bandname
from .utils import *
from main.utils import *
from django.contrib.auth.models import User
from django.http import JsonResponse
from .forms import SetPasswordForm
from datetime import datetime

def login(request):

    if request.user.is_authenticated:
        return redirect("/")
    
    if request.method == 'POST':

        # LOGIN
        login_form = AuthenticationForm(data=request.POST)
        if login_form.is_valid():
            user = auth.authenticate(
                request, 
                username=login_form.cleaned_data.get('username'), 
                password=login_form.cleaned_data.get('password')
            )
            
            if user is not None:
                auth.login(request, user)
                return HttpResponseRedirect("/")
            else:
                login_form.add_error(None, "Invalid username or password.")

        # SIGNUP
        signup_form = UserCreationForm(data=request.POST)
        if signup_form.is_valid():
            new_user = signup_form.save()
            new_user = auth.authenticate(username=signup_form.cleaned_data['username'],
                                    password=signup_form.cleaned_data['password1'])
            auth.login(request, new_user)
            return HttpResponseRedirect("/")
        
    else:
        login_form = AuthenticationForm()
        signup_form = UserCreationForm()
    
    return render(request, "registration/login.html", {
        "login_form": login_form, 
        "signup_form": signup_form
        })

def profile(request):
    user_submissions = Bandname.objects.filter(username=request.user).all()
    user = User.objects.get(pk=request.user.id)

    # Remove bandnames from users' judgement history if they've been deleted
    deleted_bandname_cleanup(request)
    
    bn_submitted = len(user_submissions)
    score = set_user_score(user, user_submissions)
    righteous_bn_count = len(get_righteous_bandnames(user_submissions))
    blasphemous_bn_count = len(get_blasphemous_bandnames(user_submissions))
        
    if request.user.is_authenticated:
        ctxt = {
            "user": request.user,
            "profanity_filter": request.user.profile.profanity_filter,
            "score": score,
            "title": "Bandnames.cool | Profile",
            "footer_text": f"© {datetime.now().year} Bandnames.cool",
            "bn_submitted": bn_submitted,
            "righteous_bn_count": righteous_bn_count,
            "blasphemous_bn_count": blasphemous_bn_count,
        }
    else:
        return redirect("/")

    return render(request, "registration/profile.html", context=ctxt)

def toggle_profanity(request):

    if request.method == "POST": 

        user = User.objects.get(pk=request.user.id)
        profanity = user.profile.profanity_filter

        if (profanity == True):
            user.profile.profanity_filter = False
        else:
            user.profile.profanity_filter = True
        user.save()

    return HttpResponse(profanity)

# Server-side pagination for the user submissions table
def get_user_submissions(request):
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
    
def change_password(request):
    user = request.user 
    form = SetPasswordForm(user)
    return render(request, 'registration/password_reset_form.html', {'form': form})

def get_voted_history(request):
    voted_bandnames_objs = []
    if request.user.is_authenticated:
        if request.method == "GET":
            
            search_query = request.GET.get('search[value]')
            column_id = int(request.GET.get('order[0][column]'))
            direction = request.GET.get('order[0][dir]')
            data = []
            voted_bandnames = request.user.profile.voted_bandnames
            user = User.objects.get(pk=request.user.id)

            # Ensure the user has voted on something before proceeding
            if voted_bandnames != None:

                # Populate the final list used by the DataTable
                for entry in voted_bandnames.copy():

                    # Try to make an entry (otherwise delete because it was probably a leftover)
                    try:
                        
                        json_entry = {
                            "bandname": censor_bandname(entry) if user.profile.profanity_filter else entry,
                            "score": voted_bandnames[entry]['score'],
                            "username": voted_bandnames[entry]['username'],
                            "date_submitted": voted_bandnames[entry]['date_submitted'],
                        }
                        data.append(json_entry)
                    except:
                        del voted_bandnames[entry]
                        
                submission_count = len(data)
                _start = request.GET.get('start')
                _length = request.GET.get('length')
                page = 0
                length = 0
                per_page = 10

                # Process sorting and searching
                data = sort_table(data, column_id, direction)
                if search_query:
                    for bandname in data.copy():
                        if search_query.lower() not in bandname['bandname'].lower():
                            data.remove(bandname)
                    data = sort_table(data, column_id, direction)

                if _start and _length:
                    start = int(_start)
                    length = int(_length)
                    page = math.ceil(start / length) + 1
                    per_page = length
                    data = data[start:start + length]
                    lookup_list = []

                    # Ensuring that the name the user voted on is the same as the actual 
                    #   score in the database
                    for entry in data: 
                        lookup_list.append(entry['bandname'])

                    bandnames = list(Bandname.objects.filter(bandname__in=lookup_list).order_by('bandname')) 
                    for bandname in bandnames:
                        for voted_name in user.profile.voted_bandnames:
                            if (bandname.bandname == voted_name):
                                if bandname.score != user.profile.voted_bandnames[voted_name]['score']:
                                    user.profile.voted_bandnames[voted_name]['score'] = bandname.score
                    user.save()

                response = {
                    "data": data,
                    "page": page,
                    "per_page": per_page,
                    "recordsTotal": submission_count,
                    "recordsFiltered": submission_count,
                }
                return JsonResponse(response)

    response = {
        "data": voted_bandnames_objs,
        "page": 0,
        "per_page": 0,
        "recordsTotal": 0,
        "recordsFiltered": 0,
    }
    return JsonResponse(response)