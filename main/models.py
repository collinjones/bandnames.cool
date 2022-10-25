from djongo import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField
from traitlets import default

# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    bandname_censored = models.CharField(max_length=128, default="")
    username = models.CharField(max_length=150)
    score = models.IntegerField()
    date_submitted = models.DateField(default=now().strftime("%Y-%m-%d"))
    ip_address = models.GenericIPAddressField(default='0.0.0.0')
    ip_addresses_voted = ArrayField(models.GenericIPAddressField(default = '0.0.0.0'), default = ['0.0.0.0'])
    
    def __str__(self):
        return self.bandname