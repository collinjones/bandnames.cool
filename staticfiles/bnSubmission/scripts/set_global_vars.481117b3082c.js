var bandnames = []
'{% for bandname in bandnames %}'
    console.log("{{profanity_filter}}")
    if ("{{profanity_filter}}" == "True"){
        bandnames.push('{{bandname|censor}}')
    }
    else {
        bandnames.push('{{bandname}}')
    }
    console.log(bandnames)
'{% endfor %}'