/* static/p5/wheel/sketch.js - p5 sketch for the bandname wheel */

var canvas, wheel;

var pAngle, v2, mousePosX, mousePosY;
var final_rotations;
var spinButton;
var doth_text = $('#doth-text')
var genreElement = $('#genres-div')
var bandnameSelectedHeader = $('#bandname-selected');

var font;
var tick_sfx, vinyl_img, picker;
var animation = [];
var wheel_imgs = [];
var isDragging = false;
p5.disableFriendlyErrors = true;

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

    // Hide doth text if wheel is spinning / no bandname is selected
    if (wheel.isEmptyObject(wheel.bandnameSelected)) {
        dothText.style.visibility = 'hidden';
        bandnameSelectedHeader.innerHTML = "<span style='color:rgb(255, 100, 100)'> Click Here to Spin the Wheel! </span>";
    } else {
        updateSelectedBandnameHeader(bandnameSelectedHeader);
    }
}

function updateSelectedBandnameHeader(heading) {
    // Destructure bandnameSelected
    const [bandnameKey, bandnameValue] = Object.entries(wheel.bandnameSelected)[0];
    
    if (!objectsEqual(wheel.bandnameSelected, wheel.previousBandnameSelected)) {
        const rgb = getRandomRGB();
        const displayValue = profanity_filter === "True" ? bandnameValue : bandnameKey;

        // Create a new span element with the desired style
        const spanElement = document.createElement("span");
        spanElement.style.color = `rgb(${rgb})`;
        spanElement.textContent = displayValue;

        // Clear the heading element and append the span element
        heading.innerHTML = "";
        heading.appendChild(spanElement);

        // Set the "value" attribute to bandnameKey
        heading.setAttribute("value", bandnameKey);

        // Play the tick sound effect
        tick_sfx.play();

        // Call the function to get genres for the bandname with handling
        if(wheel.state != wheel.states.Spinning) {
            wheel.getGenresForBandnameWithHandling();
        }
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
        isDragging = true;
        wheel.angleV = 0;
        let v = createVector(pmouseX - width / 2, pmouseY - height / 2);
        wheel.pAngle = v.heading();
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
        wheel.stopWheelIfNecessary(override=true)
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