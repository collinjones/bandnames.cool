from seleniumbase import BaseCase
BaseCase.main(__name__, __file__)


class MyTestClass(BaseCase):
    def open_site_and_login(self):
        self.open("http://127.0.0.1:8000/")
        self.click('#login-link')
        self.type("#id_username", "c_man153")
        self.type("#id_password", "iwilleatyou1")
        self.click("#login-button")

    # def test_can_log_in_and_out(self):
    #     self.open_site_and_login()

    #     # Assert logged in
    #     self.assert_element("#logout-link")

    #     self.click("#logout-link")

    #     # Assert logged out
    #     self.assert_element("#login-link")

    def test_can_submit_bandname(self):
        self.open_site_and_login()
        self.type("#bandname", "Test Band1")
        self.click("#bandname-submit")
        self.click("#profile-link")
        self.type('/html/body/div[2]/div[2]/div[1]/div/div/div[2]/label/input', 'Test Band1')
        self.wait(3)

