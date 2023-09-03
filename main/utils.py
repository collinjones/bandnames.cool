from ipaddress import ip_address
from .models import Bandname
from django.utils.timezone import now
from profanity.extras import ProfanityFilter
from random import randint
from django.contrib.auth.models import User

def deleted_bandname_cleanup():
    bandnames = Bandname.objects.all()
    cleaned_list = []
    for bandname in bandnames:
        cleaned_list.append(bandname.bandname)

    users = User.objects.all()
    for user in users:
        voted_bandnames = user.profile.voted_bandnames
        if voted_bandnames:
            if not isinstance(voted_bandnames, str):
                for key in voted_bandnames.copy():
                    if key not in cleaned_list:
                        del user.profile.voted_bandnames[key]
        user.save()

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

# get_bandnames returns a list of 11 random bandnames 
def get_bandnames(collection_len):
    
    bandnames = []
    if collection_len > 8:
        bandname_indices = band_bins(collection_len) 

    # Only use binning if more than 8 bandnames exist 
    for x in range(collection_len):
        if collection_len > 8:
            bandnames.append(Bandname.objects.all()[bandname_indices[x]])
        else:
            bandnames.append(Bandname.objects.all()[x])
        if len(bandnames) == 8:
            break

    return bandnames

# Saves a bandname vote to the database
def save_vote(request, voted_bandname, duplicate_vote = None, user = None):

    if request.POST['val'] == "up":
        voted_bandname.score += 1
    else:
        voted_bandname.score -= 1

    if user:
        if not duplicate_vote:
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
            'vote_msg': 'Voted up ' + voted_bandname.bandname} if request.POST['val'] == 'up' \
        else { 
            'vote_msg': 'Voted down ' + voted_bandname.bandname
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
