# Generated by Django 4.1.2 on 2023-12-02 06:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_alter_bandname_date_submitted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandname',
            name='date_submitted',
            field=models.DateTimeField(),
        ),
    ]