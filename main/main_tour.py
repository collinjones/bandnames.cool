from seleniumbase import BaseCase

class MyTourClass(BaseCase):

    def test_google_tour(self):
        self.open('http://127.0.0.1:8000/')
        # self.wait_for_element('#bandname')

        self.create_tour(theme="introjs")
        self.add_tour_step("Welcome to bandnames.cool, a site for submitting and voting on cool bandnames.", title="Welcome")
        self.add_tour_step("Submit a bandname here. You do not need an account to submit bandnames", "input[id='bandname']" ,title="Bandname Submission")

        self.add_tour_step("Spin the wheel to land on one of thousands of entries", "div[id='sketch-holder']" ,title="Bandname Wheel")

        self.add_tour_step("If you like a bandname, vote it up!", "img[id='upvote-button']" ,title="Voting")
        self.add_tour_step("If you dislike a bandname, vote it down!", "img[id='downvote-button']" ,title="Voting")
        
        self.add_tour_step("Bandnames that you vote on will appear here!", "img[id='scroll-img']" ,title="Voting History")

        self.add_tour_step("That's about it, have fun looking for cool bandnames!", title="Complete")
        self.play_tour()
        self.export_tour()
