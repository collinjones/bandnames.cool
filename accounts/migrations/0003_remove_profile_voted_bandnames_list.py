# Generated by Django 4.1 on 2022-09-28 13:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_profile_voted_bandnames_list'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='voted_bandnames_list',
        ),
    ]
