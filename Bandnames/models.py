from djongo import models

# Create your models here.
class Bandname(models.Model):
    bandname = models.CharField(max_length=128, primary_key=True)
    upvotes = models.IntegerField()
    downvotes = models.IntegerField()
    username = models.CharField(max_length=128)