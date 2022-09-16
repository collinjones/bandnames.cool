
# Function to read in user list of bandnames
def readInList(bandnamesBatch, numBool, dateBool):

    userSubmissions = bandnamesBatch.splitlines()
    cleanList = []

    # Removes numbers from beginning of bandname if checkbox is checked
    if (numBool == True):
        i = 0
        for x in userSubmissions:
            userSubmissions[i] = x.lstrip('1234567890. ')
            i += 1
            
    # Otherwise remove whitespace
    else:
        i = 0
        for x in userSubmissions:
            userSubmissions[i] = x.lstrip(' ')
            i += 1

    # Removes dates from end of bandname if checkbox is checked
    if (dateBool == True):
        i = 0
        for x in userSubmissions:
            cleanList.append(x.rstrip(")0123456789\/-.( "))
            for char in cleanList[i]:

                # Look for any instances of a left parenthesis or left bracket
                # Append a right parenthesis or bracket to the bandname
                if char == "(":
                    cleanList[i] += ")"

                if char == "[":
                    cleanList[i] += "]"
            i += 1

    # Otherwise remove whitespace 
    else:
        for x in userSubmissions:
            cleanList.append(x.rstrip(" "))

    return cleanList
