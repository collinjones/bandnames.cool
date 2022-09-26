from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='submission'),
    path('batch-submit', views.batch_submit, name='batchSubmission'),
    path('batch-create', views.batch_create, name='batchCreation'),
    path('create', views.create, name='create'),
    path('vote', views.vote, name='vote'),
    path('faq', views.faq, name='faq'),
    path('remove_bandname', views.remove_bandname, name='remove_bandname'),
    path('delete_bandname', views.delete_bandname, name='delete_bandname'),
]