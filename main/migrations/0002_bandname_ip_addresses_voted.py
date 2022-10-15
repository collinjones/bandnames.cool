# Generated by Django 4.1 on 2022-10-05 22:42

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandname',
            name='ip_addresses_voted',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.GenericIPAddressField(default='0.0.0.0'), default=['0.0.0.0'], size=None),
        ),
    ]