from djongo import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from traitlets import default

# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    bandname_censored = models.CharField(max_length=128, default="")
    username = models.CharField(max_length=150)
    score = models.IntegerField()
    date_submitted = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(default='0.0.0.0')
    ip_addresses_voted = ArrayField(models.GenericIPAddressField(default = '0.0.0.0'), default = ['0.0.0.0'])
    
    def __str__(self):
        return  "(" + timezone.localtime(self.date_submitted).strftime('%b %d, %Y, %I:%M %p')  + ")"