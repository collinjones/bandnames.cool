from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='submission'),
    path('batch-submit', views.BatchSubmit, name='batchSubmission'),
    path('create', views.create, name='create'),
]