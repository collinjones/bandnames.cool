/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas;
var wheel;
var bn_arr;
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
        button.html('Mute')
        tick_sfx.setVolume(0.5)
    } else {
        button.html('Unmute')
        tick_sfx.setVolume(0)
    }

}

// Function for spin wheel button
function spinWheel() {
    if (wheel.angleV < 10) {
        wheel.angleV = Math.random() * 20 + 5;
    }
}

function preload() {
    vinyl_img = loadImage('static/images/vinyl.png')
    pick_of_destiny_img = loadImage('static/images/pod.png')
    font = loadFont('static/bnSubmission/styles/PixeloidSans-nR3g1.ttf');
    tick_sfx = loadSound('static/sounds/tick.mp3')
    tick_sfx.setVolume(0.5)
}

function setup() {

    canvas = createCanvas(350, 500);
    canvas.parent('sketch-holder');

    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(255, 204, 0)
    frameRate(60);

    bandnames = document.getElementById("wheel-script").getAttribute("data-bandnames");
    bn_arr = bandnames.split(',')

    button = select('#mute-button')
    button.mousePressed(muteCanvas)
    spinButton = select('#spin-button')
    spinButton.mousePressed(spinWheel)

    for (var i = 0; i < bn_arr.length; i++) {
        bn_arr[i] = bn_arr[i].slice(12)
        bn_arr[i] = bn_arr[i].slice(0, -1)

        if (i == bn_arr.length - 1) {
            bn_arr[i] = bn_arr[i].slice(0, -1)
        }
    }

    wheel = new Wheel(createVector(0, 0), 500, color(255, 204, 0), bn_arr)

}

function draw() {

    background(255, 204, 0)

    wheel.update();

    const heading = document.getElementById('bandname-selected');

    if (wheel.bandnameSelected == "") {
        heading.innerHTML = "<span style='color: red'> No bandname selected - SPIN THE WHEEL</span>"
    } else if (wheel.bandnameSelected != wheel.previousBandnameSelected) {
        var r = Math.floor(Math.random() * 255) + 1;
        var g = Math.floor(Math.random() * 255) + 1;
        var b = Math.floor(Math.random() * 255) + 1;
        var rgb = r + ", " + g + ", " + b
        heading.innerHTML = "<span style='color: rgb(%rgb)'>".replace("%rgb", rgb) + wheel.bandnameSelected + "</span>";
        tick_sfx.play();
    }

    
}