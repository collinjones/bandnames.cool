# Generated by Django 4.1.2 on 2023-12-02 06:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_alter_bandname_date_submitted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandname',
            name='date_submitted',
            field=models.DateTimeField(default=datetime.datetime(2023, 12, 2, 6, 22, 44, 338409, tzinfo=datetime.timezone.utc)),
        ),
    ]
