from djongo import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    
    pass
    # add additional fields in here
    username = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        return self.username

# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    username = models.CharField(max_length=32)
    upvotes = models.IntegerField()
    downvotes = models.IntegerField()
    

    def __str__(self):
        return self.bandname