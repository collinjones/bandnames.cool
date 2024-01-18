# Generated by Django 4.1.2 on 2024-01-17 14:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_profile_voted_bandnames'),
        ('main', '0002_bandname_genres_alter_bandname_date_submitted'),
    ]

    operations = [
        migrations.CreateModel(
            name='GenreVote',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('genre', models.CharField(max_length=256)),
                ('bandname', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.bandname')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.profile')),
            ],
            options={
                'unique_together': {('user', 'bandname', 'genre')},
            },
        ),
    ]
