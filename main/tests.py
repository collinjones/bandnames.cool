from django.test import TestCase, Client
from django.contrib.auth.models import User
from main.models import Bandname, Profile
from django.utils import timezone
import json

SLUR = open("static/slur_for_testing.txt", "r").readline()

class IndexViewTest(TestCase):
    def setUp(self):
        self.user_agent = 'Mozilla/5.0'
        self.client = Client()

    def tearDown(self):
        User.objects.all().delete()
        Bandname.objects.all().delete()
        Profile.objects.all().delete()

    # == URL Tests == #
    def test_index_view_logged_out(self):
        response = self.client.get('/', HTTP_USER_AGENT=self.user_agent)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['profanity_filter'], True)
        self.assertEqual(response.context['title'], 'Bandnames.cool | Home')
        self.assertEqual(response.context['bandnames'][0][0], 'No Bandnames Available')
        self.assertEqual(response.context['count'], 0)

    # == Bandname Submission Tests == #
    def test_index_submit_bandname_logged_out(self):
        response = self.client.post(
            '/create', 
            {'bandname': 'test_bandname', 'timeDateSubmitted': timezone.now().strftime("%Y-%m-%d %H:%M:%S")}, 
            HTTP_USER_AGENT=self.user_agent
        )
        response_context = json.loads(response.content)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_context['bandname'], 'test_bandname')
        self.assertEqual(response_context['username'], 'Anonymous')
        self.assertEqual(response_context['score'], 0)
        self.assertEqual(response_context['response_msg'], "Submitted bandname: 'test_bandname'")
        self.assertIsNotNone(Bandname.objects.get(bandname='test_bandname'))
        pass

    def test_index_submit_empty_bandname_logged_out(self):
        response = self.client.post(
            '/create', 
            {'bandname': '', 'timeDateSubmitted': timezone.now().strftime("%Y-%m-%d %H:%M:%S")}, 
            HTTP_USER_AGENT=self.user_agent
        )
        response_context = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_context['response_msg'], "Please learn to read. There was no bandname to submit.")
        pass

    def test_index_submit_duplicate_bandname_logged_out(self):
        self.client.post(
            '/create', 
            {'bandname': 'test_bandname', 'timeDateSubmitted': timezone.now().strftime("%Y-%m-%d %H:%M:%S")}, 
            HTTP_USER_AGENT=self.user_agent
        )
        response = self.client.post('/create', {'bandname': 'test_bandname'}, HTTP_USER_AGENT=self.user_agent)
        response_context = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_context['response_msg'], "Sorry, somebody already thought of this one. Not submitted.")
        pass

    def test_index_submit_slur_bandname_logged_out(self):
        response = self.client.post(
            '/create', 
            {'bandname': SLUR, 'timeDateSubmitted': timezone.now().strftime("%Y-%m-%d %H:%M:%S")}, 
            HTTP_USER_AGENT=self.user_agent
        )
        response_context = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_context['response_msg'], "Rethink your life choices. Bandname not submitted.")

    # == Bandname Judging Tests == #
    def test_index_judge_bandname_logged_out(self):
        self.client.post(
            '/create', 
            {'bandname': 'test_bandname', 'timeDateSubmitted': timezone.now().strftime("%Y-%m-%d %H:%M:%S")}, 
            HTTP_USER_AGENT=self.user_agent
        )
        response = self.client.post('/vote', {'bandname': 'test_bandname', 'val': 'up'}, HTTP_USER_AGENT=self.user_agent)
        response_context = json.loads(response.content)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_context['vote_msg'], "Judged 'test_bandname' to be Righteous")
        
        # Ensure score was increased
        test_bandname = Bandname.objects.get(bandname='test_bandname') 
        self.assertEqual(test_bandname.score, 1)
        pass