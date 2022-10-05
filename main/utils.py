from ipaddress import ip_address
from .models import Bandname
import random
from django.utils.timezone import now
from profanity.extras import ProfanityFilter
import math
from random import randint

# Function to read in user list of bandnames
def read_in_list(bandnames_batch, num_bool, date_bool):

    user_submissions = bandnames_batch.splitlines()
    temp_list = []
    clean_list = []
    user_submissions = [s for s in user_submissions if s]
    
    # Removes numbers from beginning of bandname if checkbox is checked
    # Otherwise remove whitespace
    if num_bool == True:
        for i in range(len(user_submissions)):
            if user_submissions[i] != "":
                submission_numbers_removed = user_submissions[i].lstrip('1234567890.')
                temp_list.append(submission_numbers_removed)
    else:
        for i in range(len(user_submissions)):
            if user_submissions[i] != "":
                temp_list.append(user_submissions[i].lstrip(' '))
    # Removes dates from end of bandname if checkbox is checked
    # Otherwise remove whitespace
    if date_bool == True:
        for i in range(len(temp_list)):
            if temp_list[i] !=  "":
                clean_list.append(temp_list[i].rstrip(")0123456789\/-.( "))
        # Re-add the closing bracket if it one was detected
        for char_idx in range(len(clean_list[i])):
            if clean_list[i][char_idx] == "(":
                clean_list[i] += ")"
                break

            if clean_list[i][char_idx] == "[":
                clean_list[i] += "]"
                break
              
    else:
        for i in range(len(user_submissions)):
            if user_submissions[i] != "":
                clean_list.append(user_submissions[i].rstrip(" "))

    # Clean empty space around bandname
    for i in range(len(clean_list)):
        clean_list[i] = clean_list[i].strip()


    return clean_list

# create_bandname return True on successfull creation, False otherwise (if it already exists)
def create_bandname(request, new_bandname, authenticated):

    try:
        # Return a failed response if bandname exists in DB already 
        if (Bandname.objects.get(bandname = new_bandname)):
            return False

    except Bandname.DoesNotExist:
        
        # Get the bandname string from the form and create a Bandname object
        new_bandname = Bandname(bandname = new_bandname,
                                username = request.user.username if authenticated \
                                                                 else "Anonymous",
                                score = 0, 
                                date_submitted=now().strftime("%Y-%m-%d"),
                                ip_address = get_client_ip(request))

        # Save the bandname
        new_bandname.save()
        return True

# check_for_reject returns True if a reject word was found in bandname, False otherwise
def check_for_reject(bandname):

    auto_reject_words = open('static/main/filters/slurs.txt', "r")
    for slur in auto_reject_words:
        if slur.strip().lower() in bandname.strip().lower():
            return True
    
    if bandname == "":
        return True
    
    return False

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def band_bins(collection_len):

    wheel_indices = []
    wheel_capacity = 11
    bin_size = int(collection_len / wheel_capacity)
    
    for x in range(wheel_capacity):

        if (x == 0):
            rand_int = randint((bin_size*x), (bin_size*x) + bin_size)

        elif (x > 0 and x < (wheel_capacity - 1)):
            rand_int = randint((bin_size*x) + 1,(bin_size*x) + bin_size)

        elif (x == (wheel_capacity - 1)):
            rand_int = randint((bin_size*x) + 1, (collection_len - 1)) 

        wheel_indices.append(rand_int)
        
    return wheel_indices  

# get_bandnames returns a list of 11 random bandnames 
def get_bandnames(collection_len):
    
    bandnames = []
    bandname_indices = band_bins(collection_len) 

    # This will prevent segfault when collection_len is less than 11
    for x in range(collection_len):
        bandnames.append(Bandname.objects.all()[bandname_indices[x]])
        if len(bandnames) == 11:
            break

    return bandnames

def save_vote(request, voted_bandname, first_vote = None, duplicate_vote = None, user = None):

    if request.POST['val'] == "up":
        voted_bandname.score += 1
    else:
        voted_bandname.score -= 1

    if user:
        # First one must be assignment, beyond that (as long as it isn't dupe) save a new key
        if first_vote:
            user.profile.voted_bandnames = {voted_bandname.bandname : {
                "score" : voted_bandname.score,
                "username" : voted_bandname.username,
                "date_submitted" : voted_bandname.date_submitted.strftime('%m/%d/%Y'),
            }}
        elif not duplicate_vote:
            user.profile.voted_bandnames[voted_bandname.bandname] = {
                "score" : voted_bandname.score,
                "username" : voted_bandname.username,
                "date_submitted" : voted_bandname.date_submitted.strftime('%m/%d/%Y'),
            }
        user.save()

    voted_bandname.save()
    

def create_vote_json_response(request, voted_bandname, cleaned_list, table_template = None, user = None):
    
    filter = ProfanityFilter()
    json_response = {
            'vote-msg': 'Voted up'} if request.POST['val'] == 'up' \
        else { 
            'vote-msg': 'Voted down'
    }

    
    if user:
        json_response['bandname_json'] = {
            'bandname': filter.censor(voted_bandname.bandname) if user.profile.profanity_filter \
                                                            else voted_bandname.bandname,
            'username': voted_bandname.username,
            'score': voted_bandname.score,
            'authenticated': "True",
            'new_bandnames': cleaned_list,
            'filtered_new_bandnames': [filter.censor(x) for x in cleaned_list],
            'table_content_template': table_template
        }
    else:
        json_response['bandname_json'] = {
            'score': voted_bandname.score,
            'authenticated': "False",
            'new_bandnames': cleaned_list,
            'filtered_new_bandnames': [filter.censor(x) for x in cleaned_list],
        }
    return json_response
