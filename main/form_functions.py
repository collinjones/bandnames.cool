# These functions return JSON responses, either successful or failed */ 

from .models import Bandname, GenreVote
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth.models import User
from accounts.models import Profile
from django.utils import timezone
from datetime import date, timedelta
from .utils import *
import math 

# `create` gets called when the user submits the bandname submission form
def create(request):
    """
    Handle the creation of a new bandname.

    Args:
    request: HttpRequest object

    Returns:
    JsonResponse object
    """
    if request.method != 'POST':
        return JsonResponse({'response_msg': 'Invalid request'})

    form = CreateBandname(request.POST)
    if not form.is_valid():
        return JsonResponse({'response_msg': 'Invalid form'})

    NEW_BANDNAME = form.cleaned_data['bandname']
    GENRE = request.POST.get('genre')

    reject_response = is_reject_word(NEW_BANDNAME)
    if not reject_response['is_valid']:
        return JsonResponse({'response_msg': reject_response['reason']})

    time_submitted = request.POST['timeDateSubmitted']
    is_authenticated = request.user.is_authenticated
    new_bandname_obj = create_bandname(request, NEW_BANDNAME, is_authenticated, time_submitted)

    ip_address = None
    user_profile = None

    if request.user.is_authenticated:
        user_profile = request.user.profile
    else:
        ip_address = get_client_ip(request)

    if genre_is_valid(GENRE):
        genre_vote = GenreVote(user=user_profile, bandname=new_bandname_obj, genre=GENRE, ip_address=ip_address)
        genre_vote.save()

    if new_bandname_obj:
        if GENRE:
            new_bandname_obj.genres[GENRE] = {
                    "score": 1,
                    "submitted_on": now().strftime("%Y-%m-%d | %H:%M:%S"),
            }
            new_bandname_obj.save()
            
        json_response = {
            'bandname': new_bandname_obj.bandname,
            'username': request.user.username if is_authenticated else "Anonymous",
            'score': new_bandname_obj.score,
            'date_submitted': new_bandname_obj.date_submitted.strftime("%Y-%m-%d %H:%M:%S"),
            'response_msg': f"Submitted bandname: '{new_bandname_obj.bandname}'",
        }
        return JsonResponse(json_response)
    else:
        return JsonResponse({'response_msg': 'Error creating bandname'})

def vote(request):
    json_response = { 
        'vote_msg': 'Error', 
        'authenticated': request.user.is_authenticated
    }
    
    if request.method == "POST":
        json_response = build_judgement_json(request, request.POST['val'])

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
                reject_response = is_reject_word(new_bandname_str)
                if reject_response['is_valid'] == False:
                    json_response = { 'response_msg': reject_response['reason']}
                    return JsonResponse(json_response, safe = False)
                
                # Bandnames are good to submit at this point
                for bandname in batchList:
                    new_bandname = Bandname(bandname=bandname,
                                            bandname_censored=censor_bandname(bandname),
                                            username=request.user.username,
                                            score=0,
                                            date_submitted=timezone.now().strftime("%Y-%m-%d | %H:%M:%S"), 
                                            ip_address = get_client_ip(request))
                    new_bandname.save()

                json_response = {"response_msg" : "These bandnames are delicious"}

        else:
            json_response = {"response_msg" : "Please login to submit a batch"}

    return JsonResponse(json_response, safe = False)

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

def genre_is_valid(genre):
    for genre_set in get_genres().values():
        if genre in genre_set:
            return True
    return False

def userHasSubmittedGenreToBandname(user, ip_address, bandname):
    return GenreVote.objects.filter(user=user, bandname=bandname, ip_address=ip_address).exists()

def new_genre_submit(request):
    if request.method == 'POST':

        # Determine if genre is valid
        genre = request.POST.get('genre')
        if genre_is_valid(genre):
            bandname = request.POST.get('bandname')
            bandname_obj = Bandname.objects.get(bandname=bandname)
            ip_address = None
            user_profile = None

            if request.user.is_authenticated:
                user_profile = request.user.profile
            else:
                ip_address = get_client_ip(request)

            # Check if the user has supplied a genre for this bandname already, return early if so
            if userHasSubmittedGenreToBandname(user_profile, ip_address, bandname_obj):
                return JsonResponse({"response_msg": "You already submitted a genre to this bandname"})
            
            # Create the user:genre:band GenreVote relationship to ensure the user cannot submit more than 1 genre per bandname
            genre_vote = GenreVote(user=user_profile, bandname=bandname_obj, genre=genre, ip_address=ip_address)
            genre_vote.save()

            # Add 1 to the score for the genre if already exists and return early
            for key in list(bandname_obj.genres):
                if genre.lower() == key.lower():
                    bandname_obj.genres[key]['score'] += 1
                    bandname_obj.save()
                    return JsonResponse({"response_msg": f"{bandname} flavored with {genre}!"})

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