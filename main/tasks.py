from celery import shared_task
from celery import app

@app.task
def check():
    print('hello-world')
