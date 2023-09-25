/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas;
var wheel;

var pAngle;
var v2;
var mousePosX;
var mousePosY;
var final_rotations;

// var button;
var spinButton;
// var stopButton;
doth_text = $('#doth-text')

var font;
var tick_sfx;
var vinyl_img;
var picker;
var animation = [];
var wheel_imgs = [];

function setup() {

    canvas = createCanvas(500, 350);
    canvas.parent('bandnames-wheel');
    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(255, 204, 0, 0)
    frameRate(60);

    // button = select('#mute-button')
    // button.mousePressed(muteCanvas)
    spinButton = select('#bandname-selected')
    spinButton.mousePressed(spinWheel)
    // stopButton = select('#stop-button')
    // stopButton.mousePressed(stopWheel)

    final_rotations = 0
    tick_sfx.setVolume(0.1)

    wheel = new Wheel(color(255, 204, 0), bandnames, wheel_imgs)

}

function draw() {

    // Clear the canvas and update the wheel
    clear(); 
    wheel.update(); 

    final_rotations = wheel.get_rotations_final()

    const heading = document.getElementById('bandname-selected');

    /* No name selected yet */
    if (Object.keys(wheel.bandnameSelected).length === 0) {
        doth_text.css('visibility', 'hidden')
        heading.innerHTML = "<span style='color:rgb(255, 100, 100)'> Click Here to Spin the Wheel! </span>"
    } 
    /* A new name selected */
    else if (!objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)) {

        var rgb = getRandomRGB()  
        if (profanity_filter == "True"){
            heading.innerHTML = "<span value='' style='color: rgb(%rgb)'>".replace("%rgb", rgb) + Object.values(wheel.bandnameSelected)[0] + "</span>";
            heading.setAttribute("value", Object.keys(wheel.bandnameSelected)[0])
        } else {
            heading.innerHTML = "<span value='' style='color: rgb(%rgb)'>".replace("%rgb", rgb) +  Object.keys(wheel.bandnameSelected)[0] + "</span>";
            heading.setAttribute("value", Object.keys(wheel.bandnameSelected)[0])
        }
        tick_sfx.play();
    }

    if (wheel.state == "spinning" || Object.keys(wheel.bandnameSelected).length === 0) {
        document.getElementById("upvote-button").disabled = true; 
        document.getElementById("downvote-button").disabled = true; 
    }
    else {
        document.getElementById("upvote-button").disabled = false; 
        document.getElementById("downvote-button").disabled = false; 
    }

    if (voted) {
        heading.innerHTML = "<span style='color:rgb(255, 100, 100)'> No bandname selected - SPIN THE WHEEL</span>"
        heading.setAttribute("value", "")
        wheel.angle = 0;
        wheel.pastAngle = 0;
        wheel.bandnameSelected = {}
        wheel.previousBandnameSelected = {}
        voted = false;
    }
    
}

// Click and drag spin wheel logic
function mouseDragged() {
    if (mouseInsideCanvas()) {
        // Set wheel heading to correct 
        let v = createVector(mouseX - width / 2, mouseY - height / 2);
        wheel.pAngle = v.heading();
    }
}

function mouseReleased() {
    if (mouseInsideCanvas()) {
        if (mousePosX != mouseX && mousePosY != mouseY) {
            let v2 = createVector(mouseX - width / 2, mouseY - height / 2);
            wheel.angleV = v2.heading() - wheel.pAngle;
        }
    }
}

// Check if mouse is inside canvas or not
function mouseInsideCanvas() {
    if ((mouseX > 0) && (mouseX < width) &&
        (mouseY > 0) && (mouseY < height)) {
        return true
    }
    return false
}

// Logic for mute button
function muteCanvas() {
    
    if (tick_sfx.getVolume() == 0) {
        tick_sfx.setVolume(0.1)
    } else {
        tick_sfx.setVolume(0)
    }

}

// Logic for spin wheel button
function spinWheel() {
    if (wheel.angleV < 10) {
        wheel.angleV = Math.random() * 20 + 5;
    }
}

function stopWheel() {
    if (wheel.state == "spinning") {
        wheel.angleV = 0;
    }
}

function preload() {
    
    picker = loadImage('static/images/picker.png')
    font = loadFont('static/fonts/pixel.ttf');
    tick_sfx = loadSound('static/sounds/tick.mp3')
    const dir_root = "static/gifs/wheel/frame_";
    let file_type = ".png";
    let final_dir = "";

    for (var x = 1; x <= 26; x++) {
        final_dir = dir_root + x.toString() + file_type
        this.wheel_imgs.push(loadImage(final_dir))
    }
}

function objectsEqual(obj1, obj2) {
    var obj1_key = Object.keys(obj1)[0]
    var obj1_value = Object.values(obj1)[0]
    var obj2_key = Object.keys(obj2)[0]
    var obj2_value = Object.values(obj2)[0]

    if ((obj1_key == obj2_key) && (obj1_value == obj2_value)){
        return true
    }
    return false
}

function getRandomRGB() {
    var r = Math.floor(Math.random() * 255) + 100;
    var g = Math.floor(Math.random() * 255) + 100;
    var b = Math.floor(Math.random() * 255) + 100;
    return r + ", " + g + ", " + b
}