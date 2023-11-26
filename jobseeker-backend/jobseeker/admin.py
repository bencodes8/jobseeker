from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name']
    filter_horizontal = ['connections']

admin.site.register(User, UserAdmin)
admin.site.register(Job)
admin.site.register(JobPosting)
admin.site.register(Application)