function clicked() {
    var submit_button = document.getElementById("bandname-submit")
    submit_button.src="static/images/button_clicked.png"
}
function resting() {
    var submit_button = document.getElementById("bandname-submit")
    submit_button.src="static/images/button.png"
}

function dragged() {
    var submit_button = document.getElementById("bandname-submit")
    submit_button.src="static/images/button.png"
}

function vote_up_clicked() {
    var submit_button = document.getElementById("upvote-button")
    submit_button.src="static/images/uv2.png"
}

function vote_down_clicked() {
    var submit_button = document.getElementById("downvote-button")
    submit_button.src="static/images/dv2.png"
}

function vote_up_resting() {
    var submit_button = document.getElementById("upvote-button")
    submit_button.src="static/images/uv1.png"
}

function vote_down_resting() {
    var submit_button = document.getElementById("downvote-button")
    submit_button.src="static/images/dv1.png"
}

function vote_up_dragged() {
    var submit_button = document.getElementById("upvote-button")
    submit_button.src="static/images/uv1.png"
}

function vote_down_dragged() {
    var submit_button = document.getElementById("downvote-button")
    submit_button.src="static/images/dv1.png"
}

function mute_clicked() {
    var enabled = document.getElementById("mute-button").attributes[0].textContent
    var mute_button = document.getElementById("mute-button")
    if (enabled == "true"){
        document.getElementById("mute-button").attributes[0].textContent = "true"
        mute_button.src = "/static/images/sound_off.png"
    } 
    else if (enabled == "false"){
        document.getElementById("mute-button").attributes[0].textContent = "false"
        mute_button.src = "/static/images/sound_on.png"
    }
}