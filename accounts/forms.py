from django import forms
from django.contrib.auth.forms import SetPasswordForm, UserModel

# class ProfileForm(forms.Form):
#     profanity_filter = forms.BooleanField(required=False)

class SetPasswordForm(SetPasswordForm):
    class Meta:
        model = UserModel
        fields = ['password1', 'password2']
