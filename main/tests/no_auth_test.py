from seleniumbase import BaseCase
"""

class SubmissionTest(BaseCase):
    def test_submitting_no_auth(self):
        self.open("http://127.0.0.1:8000")
        self.type("#bandname", "TEST1")
        self.click("#bandname-submit")
        self.assert_text("created successfully", "#submission-status")
"""
