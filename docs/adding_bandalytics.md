# How to add new Bandalytics

1. Create the function in main/form_functions.py
   1. Ensure the function is tested and returns the correct datatype for the DataTables jQuery. 
   
2. Add the jquery in static/main/scripts/jquery/bandalytics_dt.js
   1. Copy and paste previous code/update names and variables


3. Add the URL in main/urls.py
   1. Copy previous examples
   
4. Add the option in the dropdown in the template in templates/main/bandalytics.html