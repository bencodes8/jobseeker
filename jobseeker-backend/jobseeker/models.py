from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.urls import reverse
from datetime import datetime

class Job(models.Model):
    title = models.CharField(max_length=64)
    desc = models.TextField(blank=False, default='Nothing to be found. Come back later :)')
    image = models.ImageField(upload_to='media', default=None)

    def __str__(self):
        return self.title
    
class User(AbstractUser):
    email = models.EmailField(unique=True)
    connections = models.ManyToManyField('User', blank=True, symmetrical=True)
    about_me = models.TextField(blank=True, default='No about me yet.')
    interests = models.ManyToManyField(Job, blank=True)
    bookmarks = models.ManyToManyField('JobPosting', blank=True)

class JobPosting(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, default='', related_name='creator')
    title = models.CharField(max_length=64, blank=False, default='')
    description = models.TextField(blank=False, default='')
    type_of_job = models.ManyToManyField(Job, blank=False, verbose_name='interests')
    created_at = models.DateField(auto_now_add=True)
    applicants = models.ManyToManyField(User, blank=True, related_name='applicants')
    
    def __str__(self):
        return f'{self.creator}: {self.title}'

class Application(models.Model):
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=None, null=True)

    def __str__(self):
        return f'{self.job_posting.title}: {self.applicant}'