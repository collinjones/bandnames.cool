"""""""""""


"""""""""""

userSubmissions = str

#Function to read in user list of bandnames
def read_in_list(bandnamesBatch, userBool):
    data = bandnamesBatch.read()
    userSubmissions = data.splitlines()

    i = 0
    if (userBool = True):
        for (x in userSubmissions):
            ('Old name: ', userSubmissions[i]) 
            userSubmissions[i] = x.lstrip('0123456789. ')
            ('New name: ', userSubmissions[i]) 
 
         

read_in_list(file)
