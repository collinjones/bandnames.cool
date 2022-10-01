from djongo import models
from django.utils.timezone import now
from django.contrib.auth.models import User

# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    username = models.CharField(max_length=150)
    score = models.IntegerField()
    date_submitted = models.DateField(default=now().strftime("%Y-%m-%d"))
    
    def __str__(self):
        return self.bandname