from djongo import models
from jsonfield import JSONField
from django.contrib.postgres.fields import ArrayField
from accounts.models import Profile


# Create your models here.
class Bandname(models.Model):

    bandname = models.CharField(max_length=128, primary_key=True)
    bandname_censored = models.CharField(max_length=128, default="")
    username = models.CharField(max_length=150)
    score = models.IntegerField()
    date_submitted = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(default='0.0.0.0')
    ip_addresses_voted = ArrayField(models.GenericIPAddressField(default = '0.0.0.0'), default = ['0.0.0.0'])
    genres = JSONField(default=dict)
    
    def __str__(self):
        return  str(self.bandname)
    
class GenreVote(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    bandname = models.ForeignKey(Bandname, on_delete=models.CASCADE)
    genre = models.CharField(max_length=256)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'bandname', 'ip_address')
