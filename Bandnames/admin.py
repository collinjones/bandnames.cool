from django.contrib import admin
from .models import Bandname

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser

from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ["email", "username",]

# Register your models here.
admin.site.register(Bandname)
admin.site.register(CustomUser, CustomUserAdmin)