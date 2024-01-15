/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas;
var wheel;

var pAngle;
var v2;
var mousePosX;
var mousePosY;
var final_rotations;
var spinButton;
var doth_text = $('#doth-text')

var font;
var tick_sfx;
var vinyl_img;
var picker;
var animation = [];
var wheel_imgs = [];

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

    wheel = new Wheel(WHEEL_COLOR, bandnames, wheel_imgs)
}

function draw() {
    clear();
    wheel.update();

    updateBandnameDisplay();
    toggleVotingLinks();
    resetWheelOnVote();
}

function updateBandnameDisplay() {
    const heading = document.getElementById('bandname-selected');
    const dothText = document.getElementById('doth-text'); // Assuming doth_text is an element

    if (Object.keys(wheel.bandnameSelected).length === 0) {
        dothText.style.visibility = 'hidden';
        heading.innerHTML = "<span style='color:rgb(255, 100, 100)'> Click Here to Spin the Wheel! </span>";
    } else {
        updateHeading(heading);
    }
}

function updateHeading(heading) {
    const bandnameKey = Object.keys(wheel.bandnameSelected)[0];
    const bandnameValue = wheel.bandnameSelected[bandnameKey];
    const rgb = getRandomRGB();

    if (!objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)) {
        const displayValue = profanity_filter === "True" ? bandnameValue : bandnameKey;
        heading.innerHTML = `<span style='color: rgb(${rgb})'>${displayValue}</span>`;
        heading.setAttribute("value", bandnameKey);
        tick_sfx.play();
    }
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
        heading.innerHTML = "<span style='color:rgb(255, 100, 100)'> No bandname selected - SPIN THE WHEEL</span>";
        heading.setAttribute("value", "");
        wheel.reset_wheel();
        voted = false;
    }
}

function mousePressed() {
    if (mouseInsideCanvas()) {
        wheel.mouseStartedInsideCanvas = true
    }
}

function mouseDragged() {
    if (wheel.mouseStartedInsideCanvas) { 
        wheel.angleV = 0;
        let v = createVector(pmouseX - width / 2, pmouseY - height / 2);
        wheel.pAngle = v.heading();
    }
}

function mouseReleased() {
    if (mousePosX != mouseX && mousePosY != mouseY) {
        if (wheel.mouseStartedInsideCanvas) {
            let v2 = createVector(mouseX - width / 2, mouseY - height / 2);
            wheel.angleV = v2.heading() - wheel.pAngle;
        }
        wheel.mouseStartedInsideCanvas = false
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

// Function for spin wheel button
function handleSpinButton() {

    if (wheel.state == wheel.states.Spinning) {
        console.log("Stopping wheel")
        wheel.stopWheelIfNecessary(override=true)
    } else {
        console.log("Spinning wheel")
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