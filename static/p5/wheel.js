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

class Wheel {
    
    constructor(position, radius, color, bandnames) {

        this.states = { Stopped: "stopped",
                        Spinning: "spinning",
                        }
        this.state = this.states.Stopped;
        this.position = position
        this.radius = radius;
        this.color = color;

        this.angle = 0;
        this.pastAngle = 0;
        this.angleV = 0.0;
        this.angleA = 0;
        this.pAngle = 0;

        this.bandnames = bandnames
        this.bandnamesOnWheel = []
        this.stopVelocity = 0.0010;
        this.slowRate = -0.01;
        this.bandnameSelected = "";
        this.previousBandnameSelected = "";
        this.evenSeparatorDeg;
        this.populateWheel();
        
    }

    refreshWheel() {
        this.bandnamesOnWheel = []
        this.populateWheel();
    }

    populateWheel() {
        for (var i = 0; i < this.bandnames.length; i++) {

            if (this.bandnamesOnWheel.length > 10) {
                break;
            }

            var currentSelection = this.bandnames[Math.floor(Math.random() * this.bandnames.length)];
            for (var j = 0; i < this.bandnamesOnWheel.length; j++) {
                if (this.bandnamesOnWheel[j] == currentSelection) {
                }
            }

            this.bandnamesOnWheel.push(currentSelection)
                
        }
        this.evenSeparatorDeg = 360 / this.bandnamesOnWheel.length
    }

    slowDownWheel() {
        if(this.state == this.states.Spinning){
            this.angleV += this.angleV * this.slowRate;
        }
    }

    chooseBandname() {
        for (var i = 0; i < this.bandnamesOnWheel.length; i++) {
            if ((this.angle > (this.evenSeparatorDeg * i)) && (this.angle < (this.evenSeparatorDeg * i) + this.evenSeparatorDeg)) {
                this.previousBandnameSelected = this.bandnameSelected;
                this.bandnameSelected = this.bandnamesOnWheel[this.bandnamesOnWheel.length - (i + 1)]
                
            }
        }
    }

    checkAndStopWheel() {
        if (this.angleV < this.stopVelocity || this.angleV == 0) {
            this.angleV = 0;
            this.state = this.states.Stopped

            this.chooseBandname();
            return true
        }
        this.chooseBandname();
        this.pastAngle = this.angle;
        this.state = this.states.Spinning
        return false
    }

    update() {

        // Ensure mouse is inside canvas
        if ((mouseX > 0) && (mouseX < width) &&
            (mouseY > 0) && (mouseY < height)) {

            if (mouseIsPressed) {
                this.state = this.states.Spinning
                this.angleV = 0;

                mousePosX = mouseY
                mousePosY = mouseY

                let dy = mouseY - pmouseY;
                let v = createVector(mouseX - width / 2, mouseY - height / 2);
                
                // Ensure mouse is heading downwards
                if (dy > 0 && mouseX > width/2) {
                    this.angle = this.pastAngle + dy * 0.5;
                    this.pastAngle = this.angle;
                } 
            }
        }
        
        push();

        translate(-150, height/2);
        rotate(this.angle);
        this.render();
        translate(150, -height/2);
        
        pop();

        this.slowDownWheel();
        this.checkAndStopWheel();
        this.checkAndResetAngle();
        
    }

    checkAndResetAngle() {
        if (this.angle > 360) {
            this.pastAngle = 0;
            this.angle = 0;
        }
    }

    renderLines() {
        for (var i = 0; i <= this.bandnamesOnWheel.length+1; i++) {
            line(0, 0, this.radius/2, 0)
            rotate(this.evenSeparatorDeg)
        }
    }

    renderBandnames() {
        
        // Set up the text settings. 
        textFont(font);
        textSize(16);
        fill(0, 0, 0, 255)

        // Draw each bandname 175px from center while rotating 0.2 radians for each name
        push();
        rotate(this.evenSeparatorDeg / 2)
        for (var i = 0; i < this.bandnamesOnWheel.length; i++) {
            
            text(this.bandnamesOnWheel[i], 175, 0)
            rotate(this.evenSeparatorDeg)
        }
        pop();
    }

    renderWheel() {
        // Fill and draw the wheel
        strokeWeight(2)
        fill(this.color["levels"][0], this.color["levels"][1], this.color["levels"][2])
        ellipse(this.position.x, this.position.y, this.radius)
    }

    render() {
        this.renderWheel();
        this.renderBandnames();
        this.renderLines();
    }
};

function mouseDragged() {
    if (mouseInsideCanvas()){
        wheel.angleV = 0;
        let v = createVector(pmouseX - width / 2, pmouseY - height / 2);
        wheel.pAngle = v.heading();
    }
}

function mouseReleased() {
    if (mouseInsideCanvas()){
        if (mousePosX != mouseX && mousePosY != mouseY){
            let v2 = createVector(mouseX - width / 2, mouseY - height / 2);
            wheel.angleV = v2.heading() - wheel.pAngle;
        }
    }
}

function mouseInsideCanvas() {
    if ((mouseX > 0) && (mouseX < width) &&
            (mouseY > 0) && (mouseY < height)) {
        return true
    }
    return false
}

function muteCanvas() {
    if(tick_sfx.getVolume() == 0){
        button.html('Mute')
        tick_sfx.setVolume(0.5)
    }
    else {
        button.html('Unmute')
        tick_sfx.setVolume(0)
    }
    
}

function spinWheel() {
    if (wheel.angleV < 10) {
        wheel.angleV = 20;
    }
}

function preload() {
    font = loadFont('static/bnSubmission/styles/PixeloidSans-nR3g1.ttf');
    tick_sfx = loadSound('static/sounds/tick.mp3')
    tick_sfx.setVolume(0.5)
}

function setup() {
    var canvas = createCanvas(400, 600);
    canvas.parent('sketch-holder');
    
    angleMode(DEGREES);
    ellipseMode(CENTER);
    background(255, 204, 0)
    frameRate(60);

    bandnames = document.getElementById("wheel-script").getAttribute( "data-bandnames" );
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

    wheel = new Wheel(createVector(0, 0), 1000, color(255, 204, 0), bn_arr)

}

function draw() {
    
    background(255, 204, 0)
    
    wheel.update();
    wheel.angle += wheel.angleV;
    wheel.angleV += wheel.angleA;
    
    strokeWeight(2)
    fill(200, 50, 0)
    triangle(
                width - 50, height/2 -  0, 
                width-2, height/2 - 20, 
                width-2, height/2 + 20
            );

    const heading = document.getElementById('bandname-selected');

    if (wheel.bandnameSelected == "") {
        heading.innerHTML = "<span style='color: red'> No bandname selected - SPIN THE WHEEL</span>"
    }
    else if (wheel.bandnameSelected != wheel.previousBandnameSelected ){
        var r = Math.floor(Math.random() * 255) + 1;
        var g = Math.floor(Math.random() * 255) + 1;
        var b = Math.floor(Math.random() * 255) + 1;
        var rgb = r + ", " + g + ", " + b
        heading.innerHTML = "<span style='color: rgb(%rgb)'>".replace("%rgb", rgb) + wheel.bandnameSelected + "</span>";
        tick_sfx.play();
    } 
}