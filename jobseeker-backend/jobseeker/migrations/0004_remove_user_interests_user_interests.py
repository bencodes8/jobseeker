# Generated by Django 4.2.3 on 2023-09-26 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobseeker', '0003_user_about_me_user_interests_delete_profile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='interests',
        ),
        migrations.AddField(
            model_name='user',
            name='interests',
            field=models.ManyToManyField(blank=True, to='jobseeker.job'),
        ),
    ]
