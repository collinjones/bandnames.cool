"""""""""""


"""""""""""

userSubmissions = str

#Function to read in user list of bandnames
def readInList(bandnamesBatch, userBool):
    data = bandnamesBatch.read()
    userSubmissions = data.splitlines()

    i = 0
    if (userBool = True):
        for (x in userSubmissions):
            print('Old name: ', userSubmissions[i]) 
            userSubmissions[i] = x.lstrip('0123456789. ')
            print('New name: ', userSubmissions[i]) 
 
         

readInList(file)
