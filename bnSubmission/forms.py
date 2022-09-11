# accounts/forms.py
from django import forms

class CreateBandname(forms.Form):
    bandname = forms.CharField(label="Bandname", max_length=128, required=False, widget = forms.TextInput(attrs={'id':'bandname'}))

class CreateBatchBandname():
    bandnames = forms.CharField(label="Bandnames", widget=forms.Textarea())