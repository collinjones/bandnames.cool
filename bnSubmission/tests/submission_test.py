from seleniumbase import BaseCase

class SubmissionTest(BaseCase):

    def login(self):
        self.open("http://127.0.0.1:8000")
        self.click("#login-link")
        self.type("#id_username", "testuser1")
        self.type("#id_password", "easypass")
        self.click("#login-button")  

    def logout(self):
        self.click("#logout-link")

    def spin_wheel(self):
        self.wait_for_element("#defaultCanvas0")
        self.click("#spin-button")  

    def stop_wheel(self):
        self.wait_for_element("#defaultCanvas0")
        self.click("#stop-button")      

    def test_login(self):
        self.login()
        self.assert_text("Hi", "#greetings-msg")
        self.logout()

    def test_logout(self):
        self.login()
        self.logout()
        self.assert_text("You are not logged in", "#logged-out-span")

    def test_submitting_no_auth(self):
        self.open("http://127.0.0.1:8000")
        self.type("#bandname", "TEST1")
        self.click("#bandname-submit")
        self.assert_text("created successfully", "#submission-status")

    def test_submitting_auth(self):
        self.login()
        self.type("#bandname", "TEST2")
        self.click("#bandname-submit")
        self.assert_text("created successfully", "#submission-status")
        self.logout()

    def test_voting_up(self):
        self.login()
        self.spin_wheel()
        self.stop_wheel()
        self.click("#upvote-button") 
        self.assert_text("Voted up", "#submission-status")
        self.click("#delete-button0") 
        self.assert_text("has been uncast", "#submission-status")
        self.logout()

    def test_voting_down(self):
        
        self.login()
        self.spin_wheel()
        self.stop_wheel()
        self.click("#downvote-button") 
        self.assert_text("Voted down", "#submission-status")
        self.click("#delete-button0") 
        self.assert_text("has been uncast", "#submission-status")
        self.logout()
        