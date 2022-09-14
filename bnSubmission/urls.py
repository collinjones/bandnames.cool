from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='submission'),
    path('batch-submit', views.BatchSubmit, name='batchSubmission'),
    path('batch-create', views.BatchCreate, name='batchCreation'),
    path('create', views.create, name='create'),
    path('vote', views.vote, name='vote'),
]