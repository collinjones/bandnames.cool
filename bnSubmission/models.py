from djongo import models
import datetime
from django.utils.timezone import now

# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    username = models.CharField(max_length=150)
    score = models.IntegerField()
    date_submitted = models.DateField(default=now().strftime("%Y-%m-%d"))
    
    def __str__(self):
        return self.bandname