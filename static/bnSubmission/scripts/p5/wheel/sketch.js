/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas;
var wheel;
var pAngle;
var v2;
var mousePosX;
var mousePosY;
let tick_sfx;
let stickerbrush_symphony;
let font;
let button;
let spinButton
let music_slider;
let vinyl_img;
let pick_of_destiny_img;

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
        button.html('Mute Wheel')
        tick_sfx.setVolume(0.5)
    } else {
        button.html('Unmute Wheel')
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

function setVolume() {
    stickerbrush_symphony.setVolume(music_slider.value())
}

function preload() {
    vinyl_img = loadImage('static/images/vinyl.png')
    pick_of_destiny_img = loadImage('static/images/pod.png')
    font = loadFont('static/bnSubmission/styles/PixeloidSans-nR3g1.ttf');
    tick_sfx = loadSound('static/sounds/tick.mp3')
    stickerbrush_symphony = loadSound('static/sounds/sbs.wav')
    stickerbrush_symphony.setVolume(0)
    tick_sfx.setVolume(0.1)
}

function setup() {

    canvas = createCanvas(350, 500);
    canvas.parent('sketch-holder');

    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(255, 204, 0)
    frameRate(60);

    button = select('#mute-button')
    button.mousePressed(muteCanvas)
    

    music_slider = select('#volume-slider')
    music_slider.mousePressed(setVolume)

    spinButton = select('#spin-button')
    spinButton.mousePressed(spinWheel)
    spinButton = select('#stop-button')
    spinButton.mousePressed(stopWheel)

    stickerbrush_symphony.play();
    stickerbrush_symphony.stop(200)

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

    background(255, 204, 0)

    wheel.update();

    setVolume();

    objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)

    const heading = document.getElementById('bandname-selected');
    /* No name selected yet */
    if (Object.keys(wheel.bandnameSelected).length === 0) {
        heading.innerHTML = "<span style='color: red'> No bandname selected - SPIN THE WHEEL</span>"
    } 
    else if (!objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)) {
        var r = Math.floor(Math.random() * 255) + 1;
        var g = Math.floor(Math.random() * 255) + 1;
        var b = Math.floor(Math.random() * 255) + 1;
        var rgb = r + ", " + g + ", " + b
        
        if (profanity_filter == "True"){
            heading.innerHTML = "<span style='color: rgb(%rgb)'>".replace("%rgb", rgb) + Object.values(wheel.bandnameSelected)[0] + "</span>";
            heading.setAttribute("value", Object.keys(wheel.bandnameSelected)[0])
        } else {
            heading.innerHTML = "<span style='color: rgb(%rgb)'>".replace("%rgb", rgb) +  Object.keys(wheel.bandnameSelected)[0] + "</span>";
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