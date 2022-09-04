# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import CustomUser

class CreateBandname(forms.Form):
    bandname = forms.CharField(label="Bandname", max_length=128, required=False, widget = forms.TextInput(attrs={'id':'bandname'}))

class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ("username", "email")

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ("username", "email")