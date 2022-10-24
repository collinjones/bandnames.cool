
import os
from celery import Celery
from main import tasks

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BandnamesWebsite.settings")
app = Celery("BandnamesWebsite")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "run-me-every-ten-seconds": {
        "task": "tasks.check",
        "schedule": 10.0
    }
}