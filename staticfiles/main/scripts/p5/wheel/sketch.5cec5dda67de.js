/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas;
var wheel;
var pAngle;
var v2;
var mousePosX;
var mousePosY;
let tick_sfx;
let font;
let button;
let spinButton
let vinyl_img;
let pick_of_destiny_img;
var final_rotations;

function mouseDragged() {
    if (mouseInsideCanvas()) {
        
        wheel.angleV = 0;
        let v = createVector(pmouseX - width / 2, pmouseY - height / 2);
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

// Function for mute button
function muteCanvas() {
    
    if (tick_sfx.getVolume() == 0) {
        tick_sfx.setVolume(0.1)
    } else {
        tick_sfx.setVolume(0)
    }

}

// Function for spin wheel button
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
    vinyl_img = loadImage('static/images/vinyl.png')
    pick_of_destiny_img = loadImage('static/images/pod.png')
    font = loadFont('static/styles/pixel.ttf');
    tick_sfx = loadSound('static/sounds/tick.mp3')
    tick_sfx.setVolume(0.1)
}

function setup() {

    canvas = createCanvas(350, 500);
    canvas.parent('sketch-holder');

    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(255, 204, 0, 0)
    frameRate(60);

    button = select('#mute-button')
    button.mousePressed(muteCanvas)

    spinButton = select('#spin-button')
    spinButton.mousePressed(spinWheel)
    spinButton = select('#stop-button')
    spinButton.mousePressed(stopWheel)
    final_rotations = 0

    wheel = new Wheel(createVector(0, 0), 500, color(255, 204, 0), bandnames)

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

function draw() {

    clear()

    wheel.update();
    final_rotations = wheel.get_rotations_final()
    

    objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)

    const heading = document.getElementById('bandname-selected');
    /* No name selected yet */
    if (Object.keys(wheel.bandnameSelected).length === 0) {
        heading.innerHTML = "<span style='color:rgb(255, 100, 100)'> No bandname selected - SPIN THE WHEEL</span>"
    } 
    else if (!objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)) {
        var r = Math.floor(Math.random() * 255) + 100;
        var g = Math.floor(Math.random() * 255) + 100;
        var b = Math.floor(Math.random() * 255) + 100;
        var rgb = r + ", " + g + ", " + b
        
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
    
    
}