
from django.shortcuts import render
from django.http import HttpResponse
from .models import Bandname
from django.http import JsonResponse
from .forms import CreateBandname, CreateBatchBandname
from django.contrib.auth import login
from django.contrib.auth.models import User
from profanity.extras import ProfanityFilter
from .readInBandnames import readInList
import random
from django.template.loader import render_to_string
from django.utils.timezone import now

def RemoveBandname(request):

    # Ensure the request method is POST and the user is logged in
    if request.method == 'POST':
        if request.user.is_authenticated:
            user = User.objects.get(pk=request.user.id)
            bandname_str = request.POST['bandname']
            bandname_obj = Bandname.objects.get(bandname=bandname_str)
            try:
                del user.profile.voted_bandnames[bandname_str]
                bandname_obj.score -= 1
            except:
                # Shouldn't ever reach
                return HttpResponse("Bandname not in voted list")
            user.save()
            bandname_obj.save()


            json_response = { 
                'response_msg': 'Your vote on ' + bandname_str + ' has been uncast',
                'bandname': bandname_str
                 }
            
            return JsonResponse(json_response, safe = False)



    return HttpResponse('nice')

def GetBandnames(collection_len):
    bandnames = []
    for x in range(collection_len):
        bandnames.append(Bandname.objects.all()[random.randint(0, collection_len-1)])
        if len(bandnames) == 11:
            break
    return bandnames

def faq(request):
    template = "../templates/bnSubmission/faq.html"
    ctxt = {
        "title": "FAQ"
    }
    return render(request, template, context=ctxt)


def index(request):
    
    form = CreateBandname()
    bandnames = []
    collection_len = Bandname.objects.count()
    cleaned_list = []
    voted_bandnames_objs = []
    profanity_filter = True

    # Get 11 bandnames for the wheel
    bandnames = GetBandnames(collection_len)

    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    if request.user.is_authenticated:

        user = User.objects.get(pk=request.user.id)
        profanity_filter = user.profile.profanity_filter
        voted_bandnames = user.profile.voted_bandnames

        if (voted_bandnames is not None):
            for voted_bandname in voted_bandnames:
                # Only append bandnames that are in the database, otherwise skip it. 
                # Todo: Add code to remove the voted_bandname that wasn't found in the except. 
                try:
                    voted_bandnames_objs.append(Bandname.objects.get(bandname=voted_bandname))
                except:
                    pass
        
        voted_bandnames_objs.sort(key=lambda x: x.score, reverse=True)


    # Is database empty?
    if len(cleaned_list) == 0:
        cleaned_list.append("NO BANDNAMES AVAILABLE")

    ctxt = {
            "title"     : "Submission Page",
            "profanity_filter": profanity_filter,
            "bandnames": cleaned_list,
            "voted_bandnames": voted_bandnames_objs,
            "count": collection_len,
            "form"      : form
           }

    return render(request, "../templates/bnSubmission/submission.html", context=ctxt)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
    

def create(request):

    if request.method == 'POST':

        form = CreateBandname(request.POST)

        if form.is_valid():

            # User is logged in
            if request.user.is_authenticated:
                auto_reject_words = open('static/bnSubmission/filters/slurs.txt', "r")
                for slur in auto_reject_words:

                    if slur.strip().lower() in form.cleaned_data['bandname'].strip().lower():
                        json_response = { 'response_msg': 'Why would you try to submit that?' }
                        return JsonResponse(json_response, safe = False)

                if form.cleaned_data['bandname'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                if "<script>" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if "DROP TABLE" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if "DROP NAMES" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if "DROP BANDNAMES" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                # Return a failed response if bandname exists in DB already 
                try:
                    if (Bandname.objects.get(bandname = form.cleaned_data['bandname'])):
                        json_response = { 'response_msg': 'Bandname already exists' }
                        return JsonResponse(json_response, safe = False)  

                # If the bandname does not exist, create it
                except Bandname.DoesNotExist:

                    new_bandname_str = form.cleaned_data['bandname']
                    new_bandname = Bandname(bandname=new_bandname_str,
                                            username=request.user.username,
                                            score=0, date_submitted=now().strftime("%Y-%m-%d"))
                    new_bandname.save()
                    json_response = {}
                    json_response['bandname_json'] = {
                                                 'bandname': new_bandname_str,
                                                 'username': request.user.username,
                                                 'score': 0
                                                }
                    json_response['response_msg'] = 'Bandname created successfully!'
                    return JsonResponse(json_response, safe = False)

            # user is not logged in
            else:
                auto_reject_words = open('static/bnSubmission/filters/slurs.txt', "r")
                for slur in auto_reject_words:

                    if slur.strip().lower() in form.cleaned_data['bandname'].strip().lower():
                        json_response = { 'response_msg': 'Why would you try to submit that?' }
                        return JsonResponse(json_response, safe = False)

                if form.cleaned_data['bandname'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                if "<script>" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if "DROP TABLE" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if "DROP NAMES" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if "DROP BANDNAMES" in form.cleaned_data['bandname']:
                    json_response = { 'response_msg': 'Try again...' }
                    return JsonResponse(json_response, safe = False)

                if form.cleaned_data['bandname'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                # Return a failed response if bandname exists in DB already 
                try:
                    if (Bandname.objects.get(bandname = form.cleaned_data['bandname'])):
                        json_response = { 'response_msg': 'Bandname already exists' }
                        return JsonResponse(json_response, safe = False)  

                # If the bandname does not exist, create it
                except Bandname.DoesNotExist:

                    new_bandname_str = form.cleaned_data['bandname']
                    new_bandname = Bandname(bandname=new_bandname_str,
                                            username="Anonymous",
                                            score=0, date_submitted=now().strftime("%Y-%m-%d"))
                    new_bandname.save()
                    json_response = {}
                    json_response['bandname_json'] = {
                                                 'bandname': new_bandname_str,
                                                 'username': "Anonymous",
                                                 'score': 0
                                                }
                    json_response['response_msg'] = 'Bandname created successfully!'
                    return JsonResponse(json_response, safe = False)
        else:
            json_response = { 'response_msg': 'Form was not valid' }
            return JsonResponse(json_response, safe = False)


def vote(request):
    
    if request.method == "POST":
        if request.user.is_authenticated:
            
            user = User.objects.get(pk=request.user.id)
            voted_bandname = Bandname.objects.get(bandname=request.POST['bandname'])
            voted_list_count = len(user.profile.voted_bandnames)
            bandnames = GetBandnames(Bandname.objects.count())
            filter = ProfanityFilter()
            cleaned_list = []
            table_template = render_to_string("../templates/bnSubmission/voted_table_content.html", context={"bandname": voted_bandname, "id": voted_list_count}, request=request)

            for new_bandname in bandnames:
                cleaned_list.append(new_bandname.bandname)
                

            # User has not voted on any bandnames
            if user.profile.voted_bandnames is None:
                
                if request.POST['val'] == "up":
                    voted_bandname.score += 1
                else:
                    voted_bandname.score -= 1
                
                # Assignment to voted_bandnames json object (since at this point it's None)
                user.profile.voted_bandnames = {voted_bandname.bandname: "voted"}

                voted_bandname.save()
                user.save()

                if request.POST['val'] == 'up':
                    json_response = { 'vote-msg': 'Voted up'}
                else:
                    json_response = { 'vote-msg': 'Voted down'}

                if (user.profile.profanity_filter):
                    json_response['bandname_json'] = {
                                                    'bandname': filter.censor(voted_bandname.bandname),
                                                    'username': voted_bandname.username,
                                                    'score': voted_bandname.score,
                                                    'authenticated': "True",
                                                    'new_bandnames': cleaned_list,
                                                    'filtered_new_bandnames': [filter.censor(x) for x in cleaned_list],
                                                    'table_content_template': table_template
                                                    }
                else:
                    json_response['bandname_json'] = {
                                                    'bandname': voted_bandname.bandname,
                                                    'username': voted_bandname.username,
                                                    'score': voted_bandname.score,
                                                    'authenticated': "True",
                                                    'new_bandnames': cleaned_list,
                                                    'filtered_new_bandnames': [filter.censor(x) for x in cleaned_list],
                                                    'table_content_template': table_template
                                                    }
                
                return JsonResponse(json_response)  

            # Bandname does not exist in user's voted bandnames
            elif not voted_bandname.bandname in user.profile.voted_bandnames:
                
                if request.POST['val'] == "up":
                    voted_bandname.score += 1
                else:
                    voted_bandname.score -= 1
                
                # Set new key
                user.profile.voted_bandnames[voted_bandname.bandname] = "voted"

                # Save the bandname and the user
                voted_bandname.save()
                user.save()

                if request.POST['val'] == 'up':
                    json_response = { 'vote-msg': 'Voted up'}
                else:
                    json_response = { 'vote-msg': 'Voted down'}

                if (user.profile.profanity_filter):
                    json_response['bandname_json'] = {
                                                    'bandname': filter.censor(voted_bandname.bandname),
                                                    'username': voted_bandname.username,
                                                    'score': voted_bandname.score,
                                                    'authenticated': "True",
                                                    'new_bandnames': cleaned_list,
                                                    'filtered_new_bandnames': [filter.censor(x) for x in cleaned_list],
                                                    'table_content_template': table_template
                                                    }
                else:
                    json_response['bandname_json'] = {
                                                    'bandname': voted_bandname.bandname,
                                                    'username': voted_bandname.username,
                                                    'score': voted_bandname.score,
                                                    'authenticated': "True",
                                                    'new_bandnames': cleaned_list,
                                                    'filtered_new_bandnames': [filter.censor(x) for x in cleaned_list],
                                                    'table_content_template': table_template
                                                    }
                return JsonResponse(json_response) 
            
            json_response = { 
                            'vote-msg': 'Already voted', 
                            'authenticated': "True" 
                            }
            return JsonResponse(json_response, safe = False) 
            
        json_response = { 
                        'vote-msg': 'Not logged in', 
                        'authenticated': "False"
                        }
        return JsonResponse(json_response, safe = False) 


def BatchSubmit(request):
    form = CreateBatchBandname()
    ctxt = {
        "title": "Batch Submission Page",
        "form": form
    }
    return render(request, "../templates/bnSubmission/batch_submission.html", context=ctxt)

def BatchCreate(request):

    # Ensure the request method is POST and the user is logged in
    if request.method == 'POST':
        if request.user.is_authenticated:
            # Get the data from the submitted form 
            form = CreateBatchBandname(request.POST)

            # Ensure the form is valid (django function)
            if form.is_valid():

                # Ensure the form is not empty, otherwise return error
                if form.cleaned_data['bandnames'] == "":
                    json_response = { 'response_msg': 'Bandname cannot be empty' }
                    return JsonResponse(json_response, safe = False)

                # Convert submitted data into a list
                batchList = readInList(form.cleaned_data['bandnames'], form.cleaned_data['numbered'], form.cleaned_data['dated'])
                
                auto_reject_words = open('static/bnSubmission/filters/slurs.txt', "r")
                for slur in auto_reject_words:
                    for name in batchList:
                        if slur.strip().lower() in name.strip().lower():
                            json_response = { 'response_msg': 'Why would you try to submit that?' }
                            return JsonResponse(json_response, safe = False)

                        if "<script>" in name.lower():
                            json_response = { 'response_msg': 'Try again...' }
                            return JsonResponse(json_response, safe = False)

                        if "DROP TABLE" in name:
                            json_response = { 'response_msg': 'Try again...' }
                            return JsonResponse(json_response, safe = False)

                        if "DROP NAMES" in name:
                            json_response = { 'response_msg': 'Try again...' }
                            return JsonResponse(json_response, safe = False)

                        if "DROP BANDNAMES" in name:
                            json_response = { 'response_msg': 'Try again...' }
                            return JsonResponse(json_response, safe = False)
                
                # Bandnames are good to submit at this point
                for bandname in batchList:
                    new_bandname = Bandname(bandname=bandname,
                                            username=request.user.username,
                                            score=0,
                                            date_submitted=now().strftime("%Y-%m-%d"))
                    new_bandname.save()

                json_response = {"response_msg":"These bandnames are delicious"}
                return JsonResponse(json_response, safe = False)

        return HttpResponse("Please login to submit a batch")

    return HttpResponse("must be POST method")
