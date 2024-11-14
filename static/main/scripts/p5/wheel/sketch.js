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
let touchStartTime;

function setup() {
    canvas = createCanvas(500, 350);
    canvas.parent('bandnames-wheel');

    const BACKGROUND_COLOR = [255, 204, 0, 0];
    const WHEEL_COLOR = color(255, 204, 0);

    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(BACKGROUND_COLOR);
    frameRate(30); // Reduced frame rate for efficiency

    const spinButton = select('#bandname-selected');
    spinButton.mousePressed(handleSpinButton);

    spinButton.elt.addEventListener('touchstart', function(event) {
        event.preventDefault();
        touchStartTime = new Date().getTime();
    });
    
    spinButton.elt.addEventListener('touchend', function(event) {
        event.preventDefault();
        let touchEndTime = new Date().getTime();
        let touchDuration = touchEndTime - touchStartTime;
    
        if (touchDuration < 10) {
            handleSpinButton();
        }
    });

    tick_sfx.setVolume(0.1);

    const bandnameSelectedHeading = document.getElementById('bandname-selected');
    bandnameSelectedHeading.innerHTML = "<span style='color:rgb(255, 100, 100)'> Click here to spin and stop the wheel</span>";
    bandnameSelectedHeading.setAttribute("value", "");

    wheel = new Wheel(WHEEL_COLOR, bandnames, wheel_imgs, bandnameSelectedHeading);
}

function draw() {
    clear();
    wheel.update();
    resetWheelOnVote();
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
        wheel.isDragging = true;
        isDragging = true;
    }
}

function mouseIsStopped() {
    return mouseX == pmouseX && mouseY == pmouseY
}

function mouseReleased() {
    // If mouse did not start inside canvas, do nothing and return
    if (!wheel.mouseStartedInsideCanvas) {
        return;
    }
    // Check if the mouse was dragged
    if (isDragging && !mouseIsStopped()) {
        let v2 = createVector(mouseX - width / 2, mouseY - height / 2);
        wheel.spin(v2.heading() - wheel.pAngle);
    }

    // Reset for the next interaction
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
    const file_type = ".png";
    const wheel_imgs_count = 26
    let final_dir = "";

    for (var x = 1; x <= wheel_imgs_count; x++) {
        final_dir = dir_root + x.toString() + file_type
        this.wheel_imgs.push(loadImage(final_dir))
    }
}

function getRandomRGB() {
    let r = Math.floor(Math.random() * 156) + 100; // 255 - 100 = 155, plus 1 to include 255
    let g = Math.floor(Math.random() * 156) + 100;
    let b = Math.floor(Math.random() * 156) + 100;
    return `${r}, ${g}, ${b}`;
}


function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}