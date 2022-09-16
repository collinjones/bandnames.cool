
#Function to read in user list of bandnames
def readInList(bandnamesBatch, numBool, dateBool):

    userSubmissions = bandnamesBatch.splitlines()
    cleanList = []

    #Removes numbers from list
    if (numBool == True):
        i = 0
        for x in userSubmissions:
            userSubmissions[i] = x.lstrip('1234567890. ')
            i += 1

    #Removes dates from list
    if (dateBool == True):
        i = 0
        for x in userSubmissions:
            cleanList.append(x.rstrip(")0123456789\/-.( "))
            i += 1
         
    return cleanList
