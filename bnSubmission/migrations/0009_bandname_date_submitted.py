# Generated by Django 4.1 on 2022-09-20 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bnSubmission', '0008_remove_bandname_date_submitted'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandname',
            name='date_submitted',
            field=models.DateField(default='2022-09-20'),
        ),
    ]
