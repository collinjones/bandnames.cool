# accounts/forms.py
from django import forms

class Vote(forms.Form):
    upvote = forms.CharField()
    downvote = forms.CharField()

class CreateBandname(forms.Form):
    bandname = forms.CharField(label="Bandname", max_length=128, required=False, widget = forms.TextInput(attrs={'id':'bandname'}))

class CreateBatchBandname(forms.Form):
    bandnames = forms.CharField(required=True, label="", widget=forms.Textarea(attrs={'id':'bandnames', 
                                                                       'placeholder': "1. The Smelly Fungers (05/03/1997) \
                                                                                    \nTargaryen Bloodstone (05/09/1997) \
                                                                                    \n3. Hogus Bogus\
                                                                                    \nSun Stinks \
                                                                                    \netc..."}))
    numbered = forms.BooleanField(label="Are any number of your bandnames numbered as shown above?", required=False)
    dated = forms.BooleanField(label="Are your bandnames dated as shown above?", required=False)