# Generated by Django 4.2.3 on 2023-09-28 05:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobseeker', '0006_remove_user_bookmarks_user_bookmarks'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobposting',
            name='type_of_job',
            field=models.ManyToManyField(to='jobseeker.job'),
        ),
    ]
