from main.models import GenreVote

# Sets the user's score when they access their profile
def set_user_score(user, user_bandnames):
    total_score = 0
    for bandname in user_bandnames:
        total_score += bandname.score
    user.profile.cumulative_score = total_score
    user.save()

    return total_score

def get_num_genres_submitted(user):
    return len(GenreVote.objects.filter(user=user.profile))
    
def get_righteous_bandnames(user_submissions):
    righteous_bandnames = []
    for bandname in user_submissions:
        if bandname.score > 0:
            righteous_bandnames.append(bandname)
    return righteous_bandnames

def get_bandnames_in_limbo(user_submissions):
    bandnames_in_limbo = []
    for bandname in user_submissions:
        if bandname.score == 0:
            bandnames_in_limbo.append(bandname)
    return bandnames_in_limbo

def get_blasphemous_bandnames(user_submissions):
    blasphemous_bandnames = []
    for bandname in user_submissions:
        if bandname.score < 0:
            blasphemous_bandnames.append(bandname)
    return blasphemous_bandnames

