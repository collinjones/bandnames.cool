
#Function to read in user list of bandnames
def readInList(bandnamesBatch, userBool):
    data = bandnamesBatch.read()
    userSubmissions = data.splitlines()


    if (userBool == True):
        x = 0
        while (x <= len(userSubmissions)):
            print('Old value: ', userSubmissions[x])
            userSubmissions[x] = userSubmissions[x].lstrip('1234567890. ')
            print('New value: ', userSubmissions[x])
            x += 1
