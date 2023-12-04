from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser, User
from .views import index

class SimpleTest(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username="jacob", email="jacob@…", password="top_secret"
        )

    def test_details(self):
            # Create an instance of a GET request.
            request = self.factory.get("/")

            response = index(request)
            self.assertEqual(response.status_code, 200)