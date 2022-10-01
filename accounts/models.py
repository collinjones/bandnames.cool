from email.policy import default
from statistics import mode
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profanity_filter = models.BooleanField(default=True)
    voted_bandnames = models.JSONField()
    cumulative_score = models.IntegerField(default=0)
    righteousness_level = models.CharField(default="Groupie", max_length=128) 

    def __str__(self):
        return str(self.user)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()