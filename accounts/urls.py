# registration/urls.py

from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("profile/", views.ProfileView, name="profile"),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("ProfanityToggle/", views.ProfanityToggle, name="ProfanityToggle"),
    path("register/", views.accounts, name="accounts"),
    path("profile/get_rows", views.get_rows, name="get_rows"),
    path("password_change/", views.password_change, name="password_change"),
]