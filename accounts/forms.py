from django import forms

class ProfileForm(forms.Form):
    profanity_filter = forms.BooleanField(required=False)
