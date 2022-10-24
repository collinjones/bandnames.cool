from celery import shared_task
from celery import app

@app.task(bind=True)
def check():
    print('hello-world')
