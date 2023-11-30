# accounts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("profile/", views.ProfileView, name="profile"),
    path("ProfanityToggle/", views.ProfanityToggle, name="ProfanityToggle"),
    path("registration/", views.Registration, name="registration"),
    path("profile/get_rows", views.get_rows, name="get_rows"),
]