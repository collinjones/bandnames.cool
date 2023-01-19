/* p5 static/p5/wheel/wheel.js - class file containing the bandnames wheel */

class Wheel {

    constructor(position, radius, color, bandnames) {

        /* Misc. attributes */
        this.states = { Stopped: "stopped", Spinning: "spinning" }  // States that the wheel can be in

        /* Bandname & Line settings */
        this.bandnames = bandnames           // Pool of bandnames to choose from
        this.bandnamesOnWheel = {}           // list of bandnames currently on the wheel
        this.bandnameSpaceFromWheel = 100;   // The amount of pixels from the center that the bandname is rendered
        this.bandnameSelected = {};          // current bandname selected
        this.previousBandnameSelected = {};  // previous frame bandname
        this.evenSeparatorDeg;               // The ammount in degrees that evenly separates elements in the wheel

        /* Wheel settings */
        this.stopVelocity = 0.10;  // lower numbers stop the wheel at a higher velocity
        this.slower_velocity_threshold = 0.50;
        this.slowRate = -0.01;       // lower numbers slow the wheel faster
        this.slow_rate_slower = -0.05;
        this.angle = 0;              // initial angle of wheel
        this.pastAngle = 0;          // previous frame angle
        this.angleV = 0.0;           // initial angle velocity
        this.angleA = 0;             // initial angle acceleration
        this.pAngle = 0;
        this.radius = radius;        // radius of the wheel
        this.color = color;          // color of the wheel 
        this.state = this.states.Stopped;  // initial state of the wheel
        this.position = position     // position of the wheel
        this.rotations = 0;
        this.rotations_final = 0;
        this.populateWheel();
    }

    setNewBandnames(bandnames) {
        this.bandnames = bandnames
    }

    /* Repopulate wheel with new bandnames */
    repopulateWheel() {
        this.bandnamesOnWheel = {}
        this.populateWheel();
    }

    /* Populate wheel with bandnames */
    populateWheel() {

        const keys = Object.keys(this.bandnames);
        const values = Object.values(this.bandnames);
        var random_i;

        var regex_replace_tuples = [
            [/&amp;/g, '&'],
            [/&#x27;/g, "'"],
            [/&quot;/g, '"']
        ]

        for (let idx in keys) {
            for (let idy in regex_replace_tuples) {
                keys[idx] = keys[idx]
                    .replace(regex_replace_tuples[idy][0], regex_replace_tuples[idy][1]);
                values[idx] = values[idx]
                    .replace(regex_replace_tuples[idy][0], regex_replace_tuples[idy][1]);
            }
        }

        // Keep looping as long as the # of bandnames on the wheel is less than 10
        while (Object.keys(this.bandnamesOnWheel).length < 10) {

            /* Get a random index and select a bandname to put on the wheel */
            random_i = Math.floor(Math.random() * keys.length);
            this.bandnamesOnWheel[keys[random_i]] = values[random_i]

            /* Exit if all bandnames supplied from Django are exausted */
            if (Object.keys(this.bandnamesOnWheel).length == keys.length){
                break;
            }

        }
        
        this.evenSeparatorDeg = 360 / Object.keys(this.bandnamesOnWheel).length
    }

    /* Slow the wheel down if its spinning */
    slowDownWheel() {
        if (this.state == this.states.Spinning) {
            if (this.angleV <= this.slower_velocity_threshold){
                this.angleV += this.angleV * this.slow_rate_slower;
            } else {
                this.angleV += this.angleV * this.slowRate;
            }
        }
    }

    /* Selects the bandname relative to what angle the wheel is at */
    chooseBandname() {

        const len = Object.keys(this.bandnamesOnWheel).length
        const keys = Object.keys(this.bandnamesOnWheel)
        const values = Object.values(this.bandnamesOnWheel)
        
        // For each bandname on the wheel
        for (var i = 0; i < Object.keys(this.bandnamesOnWheel).length; i++) {
            // Check if picker has gone over a line
            if ((this.angle > (this.evenSeparatorDeg * i)) && (this.angle < (this.evenSeparatorDeg * i) + this.evenSeparatorDeg)) {
                
                // clear the dictionary
                // this.bandnameSelected = {}  

                // Save previous bandname selected
                this.previousBandnameSelected = this.bandnameSelected;
                
                // Select the bandname 
                this.bandnameSelected = {[Object.keys(this.bandnamesOnWheel)[len - (i + 1)]]: Object.values(this.bandnamesOnWheel)[len - (i + 1)]}
            }
        }
    }

    /* Stop the wheel if slow enough */
    // Returns true if wheel stopped, false otherwise
    checkAndStopWheel() {

        // If angleV is less than the stopping threshold or the angleV is 0
        if (this.angleV < this.stopVelocity || this.angleV < 0) {

            // Stop the wheel
            this.state = this.states.Stopped
            this.angleV = 0;

            // Save the amount of times it rotated then reset 
            this.rotations_final = this.rotations
            this.rotations = 0 

            // Choose the final bandname and return true
            this.chooseBandname();
            return true
        }

        // Select the current bandname 
        this.chooseBandname();

        // Save the current angle in
        this.pastAngle = this.angle;

        // Set the state to spinning if not
        if (this.state != this.states.Spinning){
            this.state = this.states.Spinning
        }

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
            this.rotations += 1
        }
    }

    /* Render the lines on the wheel */
    renderLines() {
        for (var i = 0; i <= Object.keys(this.bandnamesOnWheel).length + 1; i++) {
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
        for (var i = 0; i < Object.keys(this.bandnamesOnWheel).length; i++) {

            // Render with profanity off
            if (profanity_filter == "True"){
                text(Object.values(this.bandnamesOnWheel)[i], this.bandnameSpaceFromWheel, 0, 150, 100)
            }
            // Render with profanity on
            else {
                text(Object.keys(this.bandnamesOnWheel)[i], this.bandnameSpaceFromWheel, 0, 150, 100)
            }
            rotate(this.evenSeparatorDeg-.5)
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

    get_rotations_final() {
        return this.rotations_final
    }
};