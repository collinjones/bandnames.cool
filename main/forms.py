# registration/forms.py
from django import forms

class Vote(forms.Form):
    upvote = forms.CharField()
    downvote = forms.CharField()

class CreateBandname(forms.Form):
    bandname = forms.CharField(
        label="Bandname", 
        max_length=128, required=False, 
        widget = forms.TextInput(attrs={'id':'bandname', 'class': 'text-cursor'})
    )

class CreateBatchBandname(forms.Form):
    bandnames = forms.CharField(
        required=True, label="", 
        widget=forms.Textarea(attrs={'id':'bandnames', 
            'placeholder': "Bandname \
            \n1. Bandname \
            \nBandname (05/05/1984)\
            \n1. Bandname (05/05/1984)"}
        )
    )
    numbered = forms.BooleanField(label="Are any of these bandnames numbered?", required=False)
    dated = forms.BooleanField(label="Are any of these bandnames dated?", required=False)