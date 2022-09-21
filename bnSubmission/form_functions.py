from django.http import HttpResponse
from .models import Bandname
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.timezone import now
from .utils import *

# == FORM ENTRY AND EXIT FUNCTIONS ==

# `create` gets called when the user submits the bandname submission form
def create(request):

    if request.method == 'POST':

        form = CreateBandname(request.POST)

        if form.is_valid():

            new_bandname_str = form.cleaned_data['bandname']

            # Check for rejects and return if found
            if check_for_reject(new_bandname_str):
                json_response = { 'response_msg': 'Why would you try to submit that?' }
                return JsonResponse(json_response, safe = False)

            # Try to create a new bandname 
            if create_bandname(request, new_bandname_str, request.user.is_authenticated):
                json_response = {
                                'bandname': new_bandname_str,
                                'username': request.user.username if request.user.is_authenticated \
                                                                  else "Anonymous",
                                'score': 0,
                                'response_msg': "Bandname %s created successfully." % new_bandname_str
                                }
            else:
                json_response = { 'response_msg': 'Bandname already exists' }

        else:
            json_response = { 'response_msg': 'Form was not valid' }

    return JsonResponse(json_response, safe = False)

# `vote` gets called when the user votes on a bandname
def vote(request):
    
    if request.method == "POST":
        if request.user.is_authenticated:
            
            user = User.objects.get(pk=request.user.id)
            voted_bandname = Bandname.objects.get(bandname=request.POST['bandname'])
            duplicate_vote = voted_bandname.bandname in user.profile.voted_bandnames

            # Return early if duplicate vote
            if duplicate_vote:
                json_response = { 
                    'vote-msg': 'Already voted', 
                    'authenticated': "True"
                }
                return JsonResponse(json_response, safe = False) 

            voted_list_count = len(user.profile.voted_bandnames)
            bandnames = get_bandnames(Bandname.objects.count())
            cleaned_list = []
            table_template = render_to_string("../templates/bnSubmission/voted_table_content.html", context={"bandname": voted_bandname, "id": voted_list_count}, request=request)
            first_vote = user.profile.voted_bandnames is None     

            # Create a list of string of each bandname
            for new_bandname in bandnames:
                cleaned_list.append(new_bandname.bandname)

            save_vote(request, voted_bandname, user, first_vote, duplicate_vote)
            json_response = create_vote_json_response(request, voted_bandname, cleaned_list, table_template, user)

        else:
            json_response = { 
                'vote-msg': 'Not logged in', 
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
                print(batchList)
                # Check for rejects and return early if any are found
                if check_for_reject(new_bandname_str):
                    json_response = { 'response_msg': 'Why would you try to submit that?' }
                    return JsonResponse(json_response, safe = False)
                
                # Bandnames are good to submit at this point
                for bandname in batchList:
                    new_bandname = Bandname(bandname=bandname,
                                            username=request.user.username,
                                            score=0,
                                            date_submitted=now().strftime("%Y-%m-%d"))
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

            del user.profile.voted_bandnames[bandname_str]
            bandname_obj.score -= 1

            user.save()
            bandname_obj.save()

            json_response = { 
                'bandname': bandname_str,
                'response_msg': 'Your vote on %s has been uncast' % bandname_str,
            }

    return JsonResponse(json_response, safe = False)