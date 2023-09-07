from django.urls import path
from . import views
from . import form_functions

urlpatterns = [
    path('', views.index, name='index'),
    path('faq', views.faq, name='faq'),
    path('bandalytics', views.bandalytics, name='bandalytics'),
    path('batch-submit', views.batch_submit, name='batchSubmission'),
    path('batch-create', form_functions.batch_create, name='batchCreation'),
    path('create', form_functions.create, name='create'),
    path('vote', form_functions.vote, name='vote'),
    path('get_voted_history', form_functions.get_voted_history, name='get_voted_history'),
    path('get_top_ten_bandnames', form_functions.get_top_ten_bandnames, name='get_top_ten_bandnames'),
    path('get_top_ten_users', form_functions.get_top_ten_users, name='get_top_ten_users'),
    path('top_bandnames_7_days', form_functions.top_bandnames_7_days, name='top_bandnames_7_days'),
    path('refresh_wheel', form_functions.refresh_wheel, name='refresh_wheel'),
]