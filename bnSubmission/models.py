from djongo import models

# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    username = models.CharField(max_length=32)
    upvotes = models.IntegerField()
    downvotes = models.IntegerField()
    
    def __str__(self):
        return self.bandname