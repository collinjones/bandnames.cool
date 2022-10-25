def set_user_score(user, user_bandnames):
    total_score = 0
    for bandname in user_bandnames:
        total_score += bandname.score
    user.profile.cumulative_score = total_score
    user.save()

    return total_score