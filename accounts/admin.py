from django.contrib import admin
from accounts.models import Profile

from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

class MyUserAdmin(UserAdmin):
    # override the default sort column
    ordering = ('date_joined', )
    # if you want the date they joined or other columns displayed in the list,
    # override list_display too
    list_display = ('username', 'email', 'date_joined', 'first_name', 'last_name', 'is_staff')

# Register your models here.
admin.site.register(Profile)
admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)