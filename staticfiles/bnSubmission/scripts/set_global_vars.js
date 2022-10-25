var bandnames = []
'{% for bandname in bandnames %}'
    if ("{{profanity_filter}}" == "True"){
        bandnames.push('{{bandname|censor}}')
    }
    else {
        bandnames.push('{{bandname}}')
    }
'{% endfor %}'