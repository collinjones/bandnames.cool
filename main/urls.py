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
    path('get_top_ten_bandnames', form_functions.get_top_ten_bandnames, name='get_top_ten_bandnames'),
    path('get_top_ten_users', form_functions.get_top_ten_users, name='get_top_ten_users'),
    path('get_righteous_ratio', form_functions.get_righteous_ratio, name='get_righteous_ratio'),
    path('recent_bandnames', form_functions.recent_bandnames, name='recent_bandnames'),
    path('refresh_wheel', views.refresh_wheel, name='refresh_wheel'),
    path('get_genre_info', form_functions.get_genre_info, name='get_genre_info'),
    path('new_genre_submit', form_functions.new_genre_submit, name='new_genre_submit'),
]