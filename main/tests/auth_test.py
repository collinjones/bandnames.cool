from seleniumbase import BaseCase
import time

class SubmissionTest(BaseCase):

    def login(self):
        self.open("http://127.0.0.1:8000")
        self.click("#login-link")
        self.type("#id_username", "testuser1")
        self.type("#id_password", "easypass")
        self.click("#login-button")  

    def logout(self):
        self.click("#logout-link", timeout=30)

    def spin_wheel(self):
        self.wait_for_element("#defaultCanvas0")
        self.click("#spin-button")  

    def stop_wheel(self):
        self.wait_for_element("#defaultCanvas0")
        self.click("#stop-button")      

    # TESTS
    def test_submitting_batch_date_num(self):
        self.login()
        self.click("#batch-submit-link", timeout=30)
        self.type("#bandnames", "1. Test A (9/22/3021) \n"\
                                "2. Test B (5/23/4172) \n"\
                                "3. Test C (2/22/9222)")
        self.click("#id_numbered")
        self.click("#id_dated")
        self.click("#batch_submit_button")
        self.refresh()
        self.click("#profile-link")
        time.sleep(5)

        self.refresh()
        bn1=self.get_attribute("//*[@id='bandnames-table-body-profile']//tr[1]", "id")
        self.assert_true(bn1=="Test A")
        bn2=self.get_attribute("//*[@id='bandnames-table-body-profile']//tr[2]", "id")
        self.assert_true(bn2=="Test B")
        bn3=self.get_attribute("//*[@id='bandnames-table-body-profile']//tr[3]", "id")
        self.assert_true(bn3=="Test C")

        self.click("#delete-button-profile1", timeout=30)
        self.click("#delete-button-profile2", timeout=30)
        self.click("#delete-button-profile3", timeout=30) 
        self.logout()
 
    def test_login(self):
        self.login()
        self.assert_text("Hi", "#greetings-msg")
        self.logout()

    def test_logout(self):
        self.login()
        self.logout()
        self.assert_text("You are not logged in", "#logged-out-span")

    def test_submitting_auth(self):
        self.login()
        self.type("#bandname", "TEST2")
        self.click("#bandname-submit")
        self.assert_text("created successfully", "#submission-status")
        self.refresh_page()
        self.click("#profile-link")
        self.refresh_page()
        self.click("//table//input[2]")
        self.logout()

    def test_delete_bandname(self):
        self.login()
        self.type("#bandname", "TEST2")
        self.click("#bandname-submit")
        self.refresh_page()
        self.click("#profile-link")
        self.refresh_page()
        self.click("//table//input[2]")
        self.assert_text("has been deleted", "#submission-status", timeout=30)
        self.logout()

    def test_voting_up(self):
        self.login()
        self.spin_wheel()
        self.stop_wheel()
        self.click("#upvote-button") 
        self.assert_text("Voted up", "#submission-status", timeout=30)
        self.click("#delete-button0") 
        self.assert_text("has been uncast", "#submission-status")
        self.logout()

    def test_voting_down(self):
        self.login()
        self.spin_wheel()
        self.stop_wheel()
        self.click("#downvote-button") 
        self.assert_text("Voted down", "#submission-status", timeout=30)
        self.click("#delete-button0") 
        self.assert_text("has been uncast", "#submission-status")
        self.logout()
        
