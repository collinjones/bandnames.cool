# accounts/urls.py

from django.urls import path
from . import views


urlpatterns = [
    path("profile/", views.ProfileView, name="profile"),
    path("ProfanityToggle/", views.ProfanityToggle, name="ProfanityToggle"),
    path("Registration/", views.Registration, name="registration"),
]