from django.contrib import admin
from .models import Bandname

class BandnameAdmin(admin.ModelAdmin):
    search_fields = ['bandname']
    list_display = ('bandname', 'score', 'date_submitted', 'username')

# Register your models here.
admin.site.register(Bandname, BandnameAdmin)