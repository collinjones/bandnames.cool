
[<img src="static/images/website_logo.png">](https://www.bandnames.cool/)

Bandnames.cool is a website driven by a community of people who love coming up with bandnames. Submit your own or spin the wheel to find out the name of your next band! 
Built from a place of nostalgia for days of geo cities, Bandnames.cool is three boys' passion project and our hopes are that our website inpires you to finally start that band. 

# Features

🗳 Vote on bandnames submitted by the community! 

🥁 Submit bandnames to the community! 

⚙️ Spin a wheel that delivers you a new bandname each time you vote!

🎸 Collect bandnames that you voted on!

🎹 See how your bandnames are scoring on your profile!

📚 View site-wide statistics such as top rated bandnames/users and more!

---

## Python Version
Uses `Python 3.11.6`

## Technical Details
I use env variables to protect the database since I don't want anyone messing with it, but the code is free to browse.

The two apps in this project are `accounts` and `main`. `main` handles most of the website logic, while I have `accounts` handle the management of a user's profile. 

### p5.js
The interactable bandname wheel is a p5.js I built then embedded. I'm able to pass data to the sketch to populate the wheel, then use some simple geometry with the wheel to calculate where the picker has "landed". Finally the sketch updates the innerHTML of an element on the page, which I can then reference using jQuery when a user decides to vote on it. 
