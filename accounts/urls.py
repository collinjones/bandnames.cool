# registration/urls.py

from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

urlpatterns = [
    path("profile/", views.profile, name="profile"),
    path('profile/get_voted_history/', views.get_voted_history, name='get_voted_history'),
    path("profile/get_user_submissions", views.get_user_submissions, name="get_user_submissions"),
    path("profile/change_password/", views.change_password, name="change_password"),
    path("profile/toggle_profanity/", views.toggle_profanity, name="toggle_profanity"),
    path('login/', views.login, name='login'),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]