# Generated by Django 4.1 on 2022-09-16 17:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bandname',
            fields=[
                ('bandname', models.CharField(max_length=128, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=32)),
                ('score', models.IntegerField()),
            ],
        ),
    ]
