# Generated by Django 4.1.2 on 2023-06-14 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_profile_last_logged_in'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='voted_bandnames',
            field=models.JSONField(default=list),
        ),
    ]