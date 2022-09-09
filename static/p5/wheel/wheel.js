/* p5 static/p5/wheel/wheel.js - class file containing the bandnames wheel */

class Wheel {

    constructor(position, radius, color, bandnames) {

        /* Misc. attributes */
        this.states = { Stopped: "stopped", Spinning: "spinning" }  // States that the wheel can be in

        /* Bandname & Line settings */
        this.bandnames = bandnames           // Pool of bandnames to choose from
        this.bandnamesOnWheel = []           // list of bandnames currently on the wheel
        this.bandnameSpaceFromWheel = 100;   // The amount of pixels from the center that the bandname is rendered
        this.bandnameSelected = "";          // current bandname selected
        this.previousBandnameSelected = "";  // previous frame bandname
        this.evenSeparatorDeg;               // The ammount in degrees that evenly separates elements in the wheel

        /* Wheel settings */
        this.stopVelocity = 0.0010;  // lower numbers stop the wheel at a higher velocity
        this.slowRate = -0.01;       // lower numbers slow the wheel faster
        this.angle = 0;              // initial angle of wheel
        this.pastAngle = 0;          // previous frame angle
        this.angleV = 0.0;           // initial angle velocity
        this.angleA = 0;             // initial angle acceleration
        this.pAngle = 0;
        this.radius = radius;        // radius of the wheel
        this.color = color;          // color of the wheel 
        this.state = this.states.Stopped;  // initial state of the wheel
        this.position = position     // position of the wheel

        this.populateWheel();

    }

    /* Repopulate wheel with new bandnames */
    repopulateWheel() {
        this.bandnamesOnWheel = []
        this.populateWheel();
    }

    /* Populate wheel with bandnames */
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

    /* Slow the wheel down if its spinning */
    slowDownWheel() {
        if (this.state == this.states.Spinning) {
            this.angleV += this.angleV * this.slowRate;
        }
    }

    /* Selects the bandname relative to what angle the wheel is at */
    chooseBandname() {
        for (var i = 0; i < this.bandnamesOnWheel.length; i++) {
            if ((this.angle > (this.evenSeparatorDeg * i)) && (this.angle < (this.evenSeparatorDeg * i) + this.evenSeparatorDeg)) {
                this.previousBandnameSelected = this.bandnameSelected;
                this.bandnameSelected = this.bandnamesOnWheel[this.bandnamesOnWheel.length - (i + 1)]

            }
        }
    }

    /* Stop the wheel if slow enough */
    checkAndStopWheel() {

        // If angleV is less than the stopping threshold or the angleV is 0
        if (this.angleV < this.stopVelocity || this.angleV < 0) {
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

    /* Main wheel logic, updates the wheel */
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
                if (dy > 0 && mouseX > width / 2) {
                    this.angle = this.pastAngle + dy * 0.5;
                    this.pastAngle = this.angle;
                }
            }
        }

        push();
        
        translate(0, height / 2);
        
        rotate(this.angle);
        this.render();
        translate(0, -height / 2);

        pop();

        this.renderPointer();
        this.slowDownWheel();
        this.checkAndStopWheel();
        this.checkAndResetAngle();

        wheel.angle += wheel.angleV;
        wheel.angleV += wheel.angleA;

    }

    /* Reset the wheel if its angle hits 360 degrees */
    checkAndResetAngle() {
        if (this.angle >= 360) {
            this.pastAngle = 0;
            this.angle = 0;
        }
    }

    /* Render the lines on the wheel */
    renderLines() {
        for (var i = 0; i <= this.bandnamesOnWheel.length + 1; i++) {
            line(0, 0, (this.radius / 2) - 8, 0)
            rotate(this.evenSeparatorDeg)
        }
    }

    /* Settings for the text */
    setUpTextSettings() {
        textFont(font);
        // textWrap(WORD)
        textSize(12);
        fill(0, 0, 0, 255)
    }

    /* Render the bandnames on the wheel */
    renderBandnames() {

        // Set up the text settings. 
        this.setUpTextSettings();

        // push() and pop() again to prevent rotating the lines
        push();

        // Rotate half the even separator 
        rotate(this.evenSeparatorDeg / 2)

        // Space out the bandnames evenly 
        for (var i = 0; i < this.bandnamesOnWheel.length; i++) {
            text(this.bandnamesOnWheel[i], this.bandnameSpaceFromWheel, 0, 150, 100)
            rotate(this.evenSeparatorDeg)
        }
        pop();
    }

    /* Render the wheel (ellipse) */
    renderWheel() {
        image(vinyl_img, -(width/2)-75, -(height/2), 500, 500)
    }

    /* Render the pointer */
    renderPointer() {

        /* DRAW PICK OF DESTINY AS PICKER */
        rotate(90)
        image(pick_of_destiny_img, (height/2)/1.25, (-width/2)*1.9, 100, 100)
    }

    /* Calls the other render functions in the proper order */
    render() {
        this.renderWheel();
        this.renderBandnames();
        this.renderLines();
    }
};



