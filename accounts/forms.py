from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import SetPasswordForm, UserModel

class SetPasswordForm(SetPasswordForm):
    class Meta:
        model = UserModel
        fields = ['password1', 'password2']
