from .models import Bandname
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth.models import User
from accounts.models import Profile
from django.template.loader import render_to_string
from django.utils.timezone import now
from datetime import date
from datetime import timedelta
from .utils import *
import math

# `create` gets called when the user submits the bandname submission form
def create(request):

    if request.method == 'POST':

        form = CreateBandname(request.POST)

        if form.is_valid():

            new_bandname_str = form.cleaned_data['bandname']

            # Check for rejects and return if found
            if check_for_reject(new_bandname_str):
                json_response = { 
                    'response_msg': 'Why would you try to submit that?',
                    'text_color': 'red'
                }
                return JsonResponse(json_response, safe = False)

            # Try to create a new bandname 
            if create_bandname(request, new_bandname_str, request.user.is_authenticated):
                json_response = {
                                'bandname': new_bandname_str,
                                'username': request.user.username if request.user.is_authenticated \
                                                                  else "Anonymous",
                                'score': 0,
                                'response_msg': "Bandname created successfully.",
                                }
            else:
                json_response = { 'response_msg': 'Bandname already exists' }

        else:
            json_response = { 'response_msg': 'Form was not valid' }

    return JsonResponse(json_response, safe = False)
    
# `vote` gets called when the user votes on a bandname
def vote(request):

    default_bandname_selected_text = 'No bandname selected - SPIN THE WHEEL'

    json_response = { 
        'vote_msg': 'Error', 
        'authenticated': "False"
    }
    if request.method == "POST":
        
        # User-Based Voting
        if request.user.is_authenticated:
            if 'bandname' in request.POST:
                if request.POST['bandname'].strip() != default_bandname_selected_text and request.POST['bandname'] != '':
                    user = User.objects.get(pk=request.user.id)
                    if user.profile.voted_bandnames:
                        first_vote = False
                    else:
                        first_vote = True
                    voted_bandname = Bandname.objects.get(bandname=request.POST['bandname'])

                    if first_vote:
                        duplicate_vote = False
                    else:
                        duplicate_vote = voted_bandname.bandname in user.profile.voted_bandnames

                        # Return early if duplicate vote
                        if duplicate_vote:
                            json_response = { 
                                'vote_msg': 'Already voted', 
                                'authenticated': "True"
                            }
                            return JsonResponse(json_response, safe = False) 

                    if not first_vote:
                        voted_list_count = len(user.profile.voted_bandnames)
                    else:
                        voted_list_count = 0

                    bandnames = get_bandnames(Bandname.objects.count())
                    cleaned_list = []
                    table_template = render_to_string(
                        "../templates/main/voted_table_content.html", 
                        context = {
                            "bandname" : voted_bandname,
                            "id" : voted_list_count
                        },
                        request = request
                    ) 

                    # Create a list of string of each bandname
                    for new_bandname in bandnames:
                        cleaned_list.append(new_bandname.bandname)

                    save_vote(request, voted_bandname, first_vote, duplicate_vote, user = user)
                    json_response = create_vote_json_response(
                        request, voted_bandname, cleaned_list, table_template, user
                    )
                else:
                    json_response = { 
                        'vote_msg': 'Spin the wheel!', 
                        'authenticated': "True"
                    }
            else:
                json_response = { 
                    'vote_msg': 'Spin the wheel!', 
                    'authenticated': "True"
                }
        # IP-Based Voting
        else:
            if 'bandname' in request.POST:
                if request.POST['bandname'] != '':
                    voted_bandname = Bandname.objects.get(bandname=request.POST['bandname'])
                    if (get_client_ip(request) not in voted_bandname.ip_addresses_voted):
                        save_vote(request, voted_bandname)
                        voted_bandname.ip_addresses_voted.append(get_client_ip(request))
                        voted_bandname.save()
                        bandnames = get_bandnames(Bandname.objects.count())
                        cleaned_list = []
                        for new_bandname in bandnames:
                            cleaned_list.append(new_bandname.bandname)

                        json_response = create_vote_json_response(request, voted_bandname, cleaned_list)
                    else:
                        json_response = { 
                            'vote_msg': 'Already voted!', 
                            'authenticated': "False"
                        }
                else:
                    json_response = { 
                        'vote_msg': 'Spin the wheel!', 
                        'authenticated': "False"
                    }
            else:
                json_response = { 
                    'vote_msg': 'Spin the wheel!', 
                    'authenticated': "False"
                }
    return JsonResponse(json_response, safe = False) 

# `batch_create` gets called when a user submits the batch creation form
def batch_create(request):

    # Ensure the request method is POST and the user is logged in
    if request.method == 'POST':
        if request.user.is_authenticated:
            # Get the data from the submitted form 
            form = CreateBatchBandname(request.POST)

            # Ensure the form is valid (django function)
            if form.is_valid():

                new_bandname_str = form.cleaned_data['bandnames']

                # Convert submitted data into a list
                batchList = read_in_list(form.cleaned_data['bandnames'], form.cleaned_data['numbered'], form.cleaned_data['dated'])
                
                # Check for rejects and return early if any are found
                if check_for_reject(new_bandname_str):
                    json_response = { 'response_msg': 'Why would you try to submit that?' }
                    return JsonResponse(json_response, safe = False)
                
                # Bandnames are good to submit at this point
                for bandname in batchList:
                    new_bandname = Bandname(bandname=bandname,
                                            bandname_censored=censor_bandname(bandname),
                                            username=request.user.username,
                                            score=0,
                                            date_submitted=now().strftime("%Y-%m-%d"), 
                                            ip_address = get_client_ip(request))
                    new_bandname.save()

                json_response = {"response_msg" : "These bandnames are delicious"}

        else:
            json_response = {"response_msg" : "Please login to submit a batch"}

    return JsonResponse(json_response, safe = False)

# `remove_bandname` called when a user clicks the remove button (trashcan) next to a voted bandname
def remove_bandname(request):

    json_response = {'response_msg': "Some error occurred"}

    # Ensure the request method is POST and the user is logged in
    if request.method == 'POST':
        if request.user.is_authenticated:

            user = User.objects.get(pk=request.user.id)
            bandname_str = request.POST['bandname']
            bandname_obj = Bandname.objects.get(bandname=bandname_str)

            try:
                del user.profile.voted_bandnames[bandname_str]
            except:
                print('please refresh')

            bandname_obj.score -= 1

            user.save()
            bandname_obj.save()

            json_response = { 
                'bandname': bandname_str,
                'response_msg': 'Your vote on %s has been uncast' % bandname_str,
            }

    return JsonResponse(json_response, safe = False)

# `delete_bandname` called when a user clicks the remove button (trashcan) next to a user bandname
def delete_bandname(request):

    if request.method == 'POST':
        if request.user.is_authenticated:

            user = User.objects.get(pk=request.user.id)
            bandname_str = request.POST['bandname']
            bandname_obj = Bandname.objects.get(bandname=bandname_str)
            all_users = User.objects.filter()

            # Remove the bandname from other users' voted bandnames list
            for user in all_users.iterator():
                try:
                    if bandname_str in user.profile.voted_bandnames:
                        del user.profile.voted_bandnames[bandname_str]
                except:
                    pass # Bandname not in voted list

            # Delete the bandname
            bandname_obj.delete()

            json_response = { 
                'bandname': bandname_str,
                'response_msg': 'Your bandname %s has been deleted' % bandname_str,
            }

    return JsonResponse(json_response, safe = False)

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

def get_top_ten_bandnames(request):
    top_ten_bandnames = list(Bandname.objects.values("username", "bandname", "score").order_by("-score")[:10])
    response = {
        "data": top_ten_bandnames,
    }
    return JsonResponse(response)

def get_top_ten_users(request):
    top_ten_users = list(Profile.objects.values("user", "cumulative_score").order_by("-cumulative_score")[:10])
    for index, entry in enumerate(top_ten_users):
        user = User.objects.get(pk=entry['user'])
        top_ten_users[index]['user'] = user.username
        
    response = {
        "data": top_ten_users,
    }
    return JsonResponse(response)

def top_bandnames_7_days(request):

    today = date.today()
    past_week = today - timedelta(days=7)

    today = str(today)
    past_week = str(past_week)

    # This should be standard Django ORM Formatting!
    top_ten_bandnames = list(Bandname.objects
        .filter(date_submitted__range = [past_week, today])
        .exclude(score__lte=0)
        .values("username", "bandname", "score", "date_submitted")
        .order_by("-score")[:10]
    )
    
    response = {
        "data": top_ten_bandnames,
    }
    return JsonResponse(response)
