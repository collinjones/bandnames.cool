# Generated by Django 4.1 on 2022-09-20 16:40

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bnSubmission', '0003_bandname_date_submitted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandname',
            name='date_submitted',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
