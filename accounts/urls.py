# registration/urls.py

from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("profile/", views.ProfileView, name="profile"),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("ProfanityToggle/", views.ProfanityToggle, name="ProfanityToggle"),
    path("registration/", views.accounts, name="accounts"),
    path("profile/get_rows", views.get_rows, name="get_rows"),
]