"""""""""""


"""""""""""

file_path = '../../../ian_bandnames.txt'
 
file = open(file_path)

userSubmissions = str

#Function to read in user list of bandnames
def readInList(bandnamesBatch):
    data = bandnamesBatch.read()
    userSubmissions = data.splitlines()

    for x in userSubmissions:
        print(x)

    #print(userSubmissions)
    #print(len(userSubmissions))

readInList(file)
