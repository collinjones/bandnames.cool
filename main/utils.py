from .models import Bandname
from django.utils.timezone import now
from profanity.extras import ProfanityFilter
from random import randint
from django.contrib.auth.models import User
import random
from .logger import SimpleLogger
import datetime
logger = SimpleLogger(log_file=f'{datetime.date.today()}_app.log').get_logger()

def deleted_bandname_cleanup(request):
    """
    Deletes bandnames from the user's voted_bandnames list if they have been deleted from the database.
    Runs each time the user visits their profile page. 
    """
    bandnames = Bandname.objects.values_list(flat=True)
    current_user = User.objects.get(pk=request.user.id)
    voted_bandnames = current_user.profile.voted_bandnames

    if voted_bandnames:
        for key in voted_bandnames.copy():
            if key not in bandnames:
                logger.info(f"Bandname {key} does not exist anymore and has been removed from {current_user.username} judgement history.")
                del current_user.profile.voted_bandnames[key]
    current_user.save()

def add_vote_obj():
    users = User.objects.all()
    for user in users:
        voted_names = user.profile.voted_bandnames
        if voted_names:
            if not isinstance(voted_names, str):
                for name in voted_names:
                    try:
                        bandname = Bandname.objects.get(bandname = name)
                        user.profile.voted_bandnames_list.add(bandname)
                    except:
                        pass

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

def get_num_asterisks(str):
    asterisks = ""
    for _ in range(len(str)):
        asterisks += "*"
    return asterisks

# Censors a bandname if it contains a word in filter.txt
def censor_bandname(bandname):
    bandname_lower = bandname.lower()
    censored_bandname = bandname
    censored_list = []

    # For each line in filter.txt, strip the filter, and if the line is contained within censored_list, append it to a list of censors (there could be multiple)
    with open('static/main/filters/filter.txt', "r") as a_file:
        for line in a_file:
            line = line.strip()
            if line in bandname_lower:
                censored_list.append(line)
                
    censored_bandname_list = censored_bandname.split()
    for filter in censored_list:
        for i, word in enumerate(censored_bandname_list):
            if filter in word.lower():
                censored_bandname_list[i] = censored_bandname_list[i].lower().replace(filter, get_num_asterisks(filter))

    censored_bandname = ' '.join(censored_bandname_list)
    return censored_bandname

def censor_bandnames(bandnames):
    cleaned_list = []
    # Censor each bandname
    for bandname in bandnames:
        cleaned_list.append((bandname, censor_bandname(bandname)))
    return cleaned_list

def censor_all_bandnames():
    bandnames = Bandname.objects.all()
    for bandname in bandnames:
        bandname.bandname_censored = censor_bandname(bandname.bandname)
        bandname.save()

# Creates a new bandname and saves it to the database. 
# Returns true if successful, false otherwise. 
def create_bandname(request, new_bandname, authenticated):

    try:
        if (Bandname.objects.get(bandname = new_bandname)):
            return False
    except Bandname.DoesNotExist:
        new_bandname = Bandname(bandname = new_bandname,
                                bandname_censored = censor_bandname(new_bandname),
                                username = request.user.username if authenticated \
                                                                 else "Anonymous",
                                score = 0, 
                                date_submitted=now().strftime("%Y-%m-%d"),
                                ip_address = get_client_ip(request))
        new_bandname.save()
        return True

# check_for_reject returns True if a reject word was found in bandname, False otherwise
def check_for_reject(bandname):

    auto_reject_words = open('static/main/filters/slurs.txt', "r")
    for slur in auto_reject_words:
        if slur.strip().lower() in bandname.strip().lower():
            return "Slur"
    
    if bandname == "":
        return "Empty"
    
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
    wheel_capacity = 8
    bin_size = int(collection_len / wheel_capacity)
    
    for x in range(wheel_capacity):
        # First pick (0) - Get random index between 0 and binsize
        if (x == 0):
            rand_int = randint(0, bin_size)

        # Middle picks (1 - 6)
        elif (x > 0 and x < (wheel_capacity - 1)):
            rand_int = randint((bin_size*x) + 1,(bin_size*x) + bin_size)

        # Final pick (7)
        elif (x == (wheel_capacity - 1)):
            rand_int = randint((bin_size*x) + 1, (collection_len - 1)) 

        wheel_indices.append(rand_int)
        
    return wheel_indices  
    

# get_random_bandnames_for_wheel returns a list of 11 random bandnames 
def get_random_bandnames_for_wheel(collection_len):
    if collection_len != 0:
        reroll_chance_threshold = -3
        bandnames = []
        righteous_bandnames = Bandname.objects.all().exclude(score__lte=-1)
        righteous_bandnames_len = righteous_bandnames.count()

        # Only use binning if more than 8 bandnames exist 
        if collection_len > 8:
            bandname_indices = band_bins(collection_len) 
        for x in range(collection_len):
            if collection_len > 8:
                bandnames.append(Bandname.objects.all()[bandname_indices[x]])
            else:
                bandnames.append(Bandname.objects.all()[x])
            if len(bandnames) == 8:
                break

        # Algorithm to potentially reroll bandnames with a score of -3 or lower
        # The lower the score, the higher the chance of being rerolled, max is -10 (100%). 
        for i, bandname in enumerate(bandnames):
            if bandname.score <= reroll_chance_threshold:
                if round(random.uniform(0, 1), 1) < 1.0 if bandname.score <= -10 else (-1*bandname.score/10):
                    bandnames[i] = Bandname.objects.all().exclude(score__lte=-1)[randint(0, righteous_bandnames_len - 1)]

        return_list = []
        for new_bandname in bandnames:
            return_list.append(new_bandname.bandname)
        return return_list

def save_vote(judgement, bandname, ip_address, user = None):
    """
    Updates a bandname's score/ip addresses voted list. 
        If a user is supplied, the bandname is added to their voted bandnames list.
    """

    bandname.ip_addresses_voted.append(ip_address)
    print(bandname.ip_addresses_voted)
    # Get the vote direction and update the bandname's score
    if judgement == "up":
        bandname.score += 1
    else:
        bandname.score -= 1

    # If user was supplied, add the bandname to their voted_bandnames list
    if user:
        user.profile.voted_bandnames[bandname.bandname] = {
            "score" : bandname.score,
            "username" : bandname.username,
            "date_submitted" : bandname.date_submitted.strftime('%m/%d/%Y'),
        }
        user.save()
    bandname.save()

def by_name(list):
    return list.get('bandname')

def by_score(list):
    return list.get('score')

def convert_bandname_objs_dict(list):
    new_bandnames_list = []
    for bandname in list:
        new_bandnames_list.append({
            "bandname": bandname.bandname,
            "score": bandname.score,
        })
    return new_bandnames_list

def sort_table(data, column_id, direction):
    sort = False if direction == "asc" \
                    else True
    if column_id == 0:
        data.sort(key = by_name, reverse = sort)
        return data     
    if column_id == 1:
        data.sort(key = by_score, reverse = sort)
        return data

def get_ip_address(request):
    user_ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
    if user_ip_address:
        ip = user_ip_address.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_random_quip(fpath):
    with open(fpath) as f:
        random_quip = random.choice(f.readlines())
        random_quip = random_quip.replace("&&&", str(Bandname.objects.count()))
        return random_quip
    
def build_judgement_json(request, judgement, default_bandname_selected_text):
    ip = get_client_ip(request)
    voted = True
    if 'bandname' in request.POST:
        # Get the user object if authenticated
        user = User.objects.get(pk=request.user.id) if request.user.is_authenticated else None
        if request.POST['bandname'] != '':
            bandname = Bandname.objects.get(bandname=request.POST['bandname'])
            
            # Ensure user has not already voted on the bandname
            if request.user.is_authenticated:
                if bandname not in user.profile.voted_bandnames:
                    voted = False
            
            # Ensure the IP address has not already voted on the bandname
            if ip not in bandname.ip_addresses_voted:
                voted = False
            else:
                voted = True

            if not voted:
                save_vote(judgement, bandname, ip, user)
                refresh_list = get_random_bandnames_for_wheel(Bandname.objects.count())
                json_response = {
                        'vote_msg': "Voted up '" + bandname.bandname + "'"} if judgement == 'up' \
                    else { 
                        'vote_msg': "Voted down '" + bandname.bandname + "'"
                }
                json_response['bandname_json'] = {
                    'authenticated': "False",
                    'new_bandnames': refresh_list,
                    'filtered_new_bandnames': [ProfanityFilter().censor(x) for x in refresh_list],
                }
            else:
                json_response = { 
                    'vote_msg': "Already voted: '" + bandname.bandname + "'", 
                    'authenticated': request.user.is_authenticated
                }
        else: 
            json_response = { 
                'vote_msg': "Spin the wheel!", 
                'authenticated': request.user.is_authenticated
            }
    else:
        json_response = { 
            'vote_msg': "Spin the wheel!", 
            'authenticated': request.user.is_authenticated
        }

    return json_response