# Generated by Django 4.1.2 on 2023-06-14 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_bandname_date_submitted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandname',
            name='date_submitted',
            field=models.DateField(default='2023-06-14'),
        ),
    ]
