/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas, wheel;

var pAngle, v2, mousePosX, mousePosY;
var final_rotations;
var spinButton;
var doth_text = $('#doth-text')
var genreElement = $('#genres-div')

var font;
var tick_sfx, vinyl_img, picker;
var animation = [];
var wheel_imgs = [];
var isDragging = false;
p5.disableFriendlyErrors = true;

let initializeCodeRan = false;

function setup() {

    // Setup canvas
    canvas = createCanvas(500, 350);
    canvas.parent('bandnames-wheel');

    const BACKGROUND_COLOR = [255, 204, 0, 0];
    const WHEEL_COLOR = color(255, 204, 0);

    // Configure canvas
    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(BACKGROUND_COLOR)
    frameRate(60);

    // Setup spin button
    const spinButton = select('#bandname-selected')
    spinButton.mousePressed(handleSpinButton)

    // Set the wheel tick sound fx volume
    tick_sfx.setVolume(0.1)

    // Initialize chosen bandname header
    const bandnameSelectedHeading = document.getElementById('bandname-selected');
    bandnameSelectedHeading.innerHTML = "<span style='color:rgb(255, 100, 100)'> Click here to spin and stop the wheel</span>";
    bandnameSelectedHeading.setAttribute("value", "");

    wheel = new Wheel(WHEEL_COLOR, bandnames, wheel_imgs, bandnameSelectedHeading)

}

function draw() {
    clear();
    wheel.update();
    toggleVotingLinks();
    resetWheelOnVote();

}

function toggleVotingLinks() {
    const upvoteLink = document.getElementById("upvote-link");
    const downvoteLink = document.getElementById("downvote-link");
    
    const isWheelSpinning = wheel.state === wheel.states.Spinning;
    upvoteLink.disabled = isWheelSpinning;
    downvoteLink.disabled = isWheelSpinning;
}

function resetWheelOnVote() {
    const heading = document.getElementById('bandname-selected');

    if (voted) {
        wheel.reset_wheel();
        voted = false;
        heading.innerHTML = "<span style='color:rgb(255, 100, 100)'> Click here to spin and stop the wheel</span>";
        heading.setAttribute("value", "");
    }
}

function mousePressed() {
    if (mouseInsideCanvas()) {
        wheel.mouseStartedInsideCanvas = true
    }
}

function mouseDragged() {
    if (wheel.mouseStartedInsideCanvas) { 
        isDragging = true;
    }
}

function mouseReleased() {
    if (isDragging) {
        if (mousePosX != mouseX && mousePosY != mouseY) {
            if (wheel.mouseStartedInsideCanvas) {
                let v2 = createVector(mouseX - width / 2, mouseY - height / 2);
                wheel.spin(v2.heading() - wheel.pAngle);
            }
        }
    }
    wheel.mouseStartedInsideCanvas = false;
    isDragging = false;
}

// Check if mouse is inside canvas or not
function mouseInsideCanvas() {
    if ((mouseX > 0) && (mouseX < width) &&
        (mouseY > 0) && (mouseY < height)) {
        return true
    }
    return false
}

// Function for spin wheel button
function handleSpinButton() {

    if (wheel.state == wheel.states.Spinning) {
        wheel.stopWheel()
    } else {
        wheel.spin(Math.random() * 20 + 5)
    } 
}

function preload() {
    
    picker = loadImage('static/images/picker.png')
    font = loadFont('static/fonts/pixel.ttf');
    tick_sfx = loadSound('static/sounds/tick.mp3')
    const dir_root = "static/gifs/wheel/frame_";
    let file_type = ".png";
    let final_dir = "";
    let wheel_imgs_count = 26

    for (var x = 1; x <= wheel_imgs_count; x++) {
        final_dir = dir_root + x.toString() + file_type
        this.wheel_imgs.push(loadImage(final_dir))
    }
}

function getRandomRGB() {
    var r = Math.floor(Math.random() * 255) + 100;
    var g = Math.floor(Math.random() * 255) + 100;
    var b = Math.floor(Math.random() * 255) + 100;
    return r + ", " + g + ", " + b
}