# accounts/forms.py
from django import forms

class CreateBandname(forms.Form):
    bandname = forms.CharField(label="Bandname", max_length=128, required=False, widget = forms.TextInput(attrs={'id':'bandname'}))

class CreateBatchBandname(forms.Form):
    bandnames = forms.CharField(label="", widget=forms.Textarea(attrs={'id':'bandnames'}))