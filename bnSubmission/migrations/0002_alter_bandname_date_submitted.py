# Generated by Django 4.1 on 2022-09-23 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bnSubmission', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandname',
            name='date_submitted',
            field=models.DateField(default='2022-09-23'),
        ),
    ]