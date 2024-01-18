# These functions return JSON responses, either successful or failed */ 

from .models import Bandname, GenreVote
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth.models import User
from accounts.models import Profile
from django.utils.timezone import now
from datetime import date, timedelta
from .utils import *
import math 

# `create` gets called when the user submits the bandname submission form
def create(request):

    if request.method == 'POST':

        form = CreateBandname(request.POST)

        if form.is_valid():

            new_bandname_str = form.cleaned_data['bandname']

            # Check for rejects and return if found
            reject_response = check_for_reject(new_bandname_str)
            if reject_response != False:
                if reject_response == "Empty":
                    response = "Enter a bandname to submit"
                elif reject_response == "Slur":
                    response = "Please do not submit anything too vulgar"
                else:
                    response = "Why would you submit that?"  
                json_response = { 
                        'response_msg': response,
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
                                'date_submitted': datetime.datetime.today(),
                                'response_msg': "Submitted bandname: '" + new_bandname_str + "'",
                                }
            else:
                json_response = { 'response_msg': 'Bandname already exists' }

        else:
            json_response = { 'response_msg': 'Form was not valid' }

    return JsonResponse(json_response, safe = False)
    
# `vote` gets called when the user votes on a bandname
def vote(request):

    # TODO - Get this dynamically somehow. Possibly from the request. 
    default_bandname_selected_text = 'Click Here to Spin the Wheel!'
    json_response = { 
        'vote_msg': 'Error', 
        'authenticated': request.user.is_authenticated
    }
    
    if request.method == "POST":
        json_response = build_judgement_json(request, request.POST['val'], default_bandname_selected_text)

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

def get_righteous_ratio(request):
    total = Bandname.objects.count()
    righteous_count = len(list(Bandname.objects.filter(score__gt=0)))
    blasphemous_count = len(list(Bandname.objects.filter(score__lt=0)))
    limbo_count = len(list(Bandname.objects.filter(score=0)))

    righteous_percentage = (righteous_count / total) * 100
    blasphemous_percentage = (blasphemous_count / total) * 100
    limbo_percentage = (limbo_count / total) * 100

    response = {
        "data": [{
            "Righteous": round(righteous_percentage, 2),
            "Blasphemous": round(blasphemous_percentage, 2),
            "Limbo": round(limbo_percentage, 2),
        }]
    }
    return JsonResponse(response)

def calculate_percentage(split1, split2, total):
    percentage1 = (split1 / total) * 100
    percentage2 = (split2 / total) * 100
    return percentage1, percentage2
 
def recent_bandnames(request):
    bandnames = list(Bandname.objects.values("bandname", "username", "date_submitted").order_by('-date_submitted')[:10])
    for bandname in bandnames:
        bandname['date_submitted'] = bandname['date_submitted'].strftime("%Y-%m-%d")
    
    return JsonResponse({"data": bandnames})

def get_genre_info(request):
    bandname = request.GET.get('bandname')
    genres = list(Bandname.objects.get(bandname=bandname).genres)

    genre_votes = {}
    for genre in genres:
        vote_count = GenreVote.objects.filter(bandname=bandname, genre=genre).count()
        genre_votes[genre] = vote_count

    # Step 3: Sort genres based on votes
    sorted_genres = sorted(genre_votes, key=genre_votes.get)

    # Step 4: Extract the top three genres
    top_three_genres = sorted_genres[:3]

    return JsonResponse({"response_msg": top_three_genres})

def new_genre_submit(request):
    if request.method == 'POST':

        # Determine if genre is valid
        genre = request.POST.get('genre')
        can_submit = False
        for genre_set in get_genres().values():
            if genre in genre_set:
                can_submit = True
                break

        if can_submit:
            bandname = request.POST.get('bandname')
            bandname_obj = Bandname.objects.get(bandname=bandname)
            ip_address = None
            user_profile = None

            if request.user.is_authenticated:
                user_profile = request.user.profile
            else:
                ip_address = get_client_ip(request)

            # Check if the user has supplied a genre for this bandname already, return early if soqqqqqqqqqqqqqqqqqqqqqqqq
            if GenreVote.objects.filter(user=user_profile, bandname=bandname, ip_address=ip_address).exists():
                return JsonResponse({"response_msg": "You already submitted a genre to this bandname"})
            
            # Create the user:genre:band GenreVote relationship to ensure the user cannot submit more than 1 genre per bandname
            genre_vote = GenreVote(user=user_profile, bandname=bandname_obj, genre=genre, ip_address=ip_address)
            genre_vote.save()

            # Add 1 to the score for the genre if already exists and return early
            for key in list(bandname_obj.genres):
                if genre.lower() == key.lower():
                    bandname_obj.genres[key]['score'] += 1
                    bandname_obj.save()
                    return JsonResponse({"response_msg": f"Submitting {genre} to band {bandname}!"})

            bandname_obj.genres[genre] = {
                "score": 1,
                "submitted_on": now().strftime("%Y-%m-%d | %H:%M:%S"),
            }
            bandname_obj.save()
            return JsonResponse({"response_msg": f"Submitting {genre} to band {bandname}!"})
        else:
            return JsonResponse({"response_msg": "Invalid genre!"})
    else:
        return JsonResponse({"response_msg": "Invalid request!"})