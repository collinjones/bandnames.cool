from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='submission'),
    path('create', views.create, name='create'),
]