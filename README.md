# [bandnames.cool](https://www.bandnames.cool)

bandnames.cool is a bandname aggregate website. We love cool bandnames. This website was created by a bunch of boys who loved keeping lists of cool bandnames they thought of.

# Features

🗳 Vote on bandnames submitted by the community! 

🥁 Submit bandnames to the community! 

⚙️ Spin a wheel that delivers you a new bandname each time you vote!

🎸 Collect bandnames that you voted on!

🎹 See how your bandnames are scoring on your profile!

📚 View site-wide statistics such as top rated bandnames/users and more!

---

## Python Version
Uses `Python 3.10.8`

## Technical Details
I use env variables to protect the database since I don't want anyone messing with it, but the code is free to browse.

The two apps in this project are `accounts` and `main`. `main` handles most of the website logic, while I have `accounts` handle the management of a user's profile. 

### p5.js
The interactable bandname wheel is a p5.js I built then embedded. I'm able to pass data to the sketch to populate the wheel, then use some simple geometry with the wheel to calculate where the picker has "landed". Finally the sketch updates the innerHTML of an element on the page, which I can then reference using jQuery when a user decides to vote on it. 

### scaling
A problem I ran into with the DataTables table plugin for jQuery was increasingly long response times when populating a table with 5 - 600 bandnames. The solution was server-side processing with pagination. The server only ever returns 100 bandnames at the maximum now, so the site can scale without issue. 
