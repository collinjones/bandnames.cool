/* p5 static/p5/wheel/wheel.js - class file containing the bandnames wheel */

var doth_text;

class Clock {
    constructor(interval) {
        this.clock_started = millis();
        this.last_trigger = millis();
        this.current_time = millis();
        this.base_interval = interval;
        this.interval = this.base_interval ;
    }

    get_interval() {
        return this.interval;
    }

    /* Sets the clock interval with a conversion from millis to sec */
    set_interval(interval) {
        this.interval = interval;
    }
    
    // Update the clock
    tick() {
      this.current_time = millis(); // Update the current time
    }
    
    /* Resets the time since last trigger */
    reset_trigger() {
      this.last_trigger = millis();
    }
    
    /* Checks If the difference between the current time and the last trigger is 
        greater than the interval, returns True if so.  */
    trigger() {
        if (this.current_time - this.last_trigger > this.interval) {
            this.reset_trigger();
            return true;
        }
        return false;
    }
}

class Wheel {

    constructor(color, bandnames, wheel_imgs) {

        this.wheel_imgs = wheel_imgs;
        this.frame_counter = 0;

        /* Misc. attributes */
        this.states = { Stopped: "stopped", Spinning: "spinning" }  // States that the wheel can be in

        /* Bandname & Line settings */
        this.bandnames = bandnames           // Pool of bandnames to choose from
        this.bandnamesOnWheel = {}           // list of bandnames currently on the wheel
        this.bandnameSpaceFromCenter = 75;   // The amount of pixels from the center that the bandname is rendered
        this.bandnameSelected = {};          // current bandname selected
        this.previousBandnameSelected = {};  // previous frame bandname
        this.evenSeparatorDeg;               // The ammount in degrees that evenly separates elements in the wheel

        /* Wheel settings */
        this.stopVelocity = 0.10;          // lower numbers stop the wheel at a higher velocity
        this.slower_velocity_threshold = 0.50;
        this.slowRate = -0.01;             // lower numbers slow the wheel faster
        this.slow_rate_slower = -0.05;
        this.angle = 0;                    // initial angle of wheel
        this.pastAngle = 0;                // previous frame angle
        this.angleV = 0.0;                 // initial angle velocity
        this.maxAngleV = 40;              // initial max angle velocity
        this.angleA = 0;                   // initial angle acceleration
        this.color = color;                // color of the wheel 
        this.state = this.states.Stopped;  // initial state of the wheel
        this.rotations = 0;
        this.rotations_final = 0;
        this.clock = new Clock(100);
        this.bn_glow_clock = new Clock(100);
        this.alpha = 0;
        this.mouseStartedInsideCanvas = false;
        this.populateWheel();
    }

    setNewBandnames(bandnames) {
        this.bandnames = bandnames
        this.repopulateWheel();
    }

    /* Repopulate wheel with new bandnames */
    repopulateWheel() {
        this.bandnamesOnWheel = {}
        this.populateWheel();
    }

    reset_wheel() {
        this.angle = 0;
        this.pastAngle = 0;
        this.bandnameSelected = {}
        this.previousBandnameSelected = {}
    }
    
    replace_char_codes(keys, values) {

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
        return [keys, values]
    }

    /* Populate wheel with bandnames */
    populateWheel() {
        var keys = Object.keys(this.bandnames);
        var values = Object.values(this.bandnames);
        var random_i;

        // Replace char codes (like &#x27; for ' and &quot; for ")
        var cleaned_bandnames = this.replace_char_codes(keys, values)
        keys = cleaned_bandnames[0]
        values = cleaned_bandnames[1]

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
        
        // Depending on the # of bn on the wheel, get the degrees of an even separation 
        //  between the bandnames on the wheel
        this.evenSeparatorDeg = 360 / Object.keys(this.bandnamesOnWheel).length
    }

    /* Slow the wheel down if its spinning */
    slowDownWheel() {
        if (this.state == this.states.Spinning) {

            // While wheel is spinning, hide the doth_test and slow down the wheel
            doth_text.css('visibility', 'hidden')
            if (abs(this.angleV) <= this.slower_velocity_threshold){
                this.angleV += this.angleV * this.slow_rate_slower;
            } else {
                this.angleV += this.angleV * this.slowRate;
            }
        }
    }

    /* Selects the bandname relative to what angle the wheel is at */
    chooseBandname() {

        const keys = Object.keys(this.bandnamesOnWheel)
        const values = Object.values(this.bandnamesOnWheel)
        const len = keys.length
        
        // For each bandname on the wheel
        for (var i = 0; i < len; i++) {  
            let angle_slice = this.evenSeparatorDeg * i

            // Angle is greater than the even separator times the index of the wheel 
            // Angle is less than the 
            if ((this.angle > angle_slice) 
             && (this.angle < angle_slice + this.evenSeparatorDeg)) {

                this.previousBandnameSelected = this.bandnameSelected;
                this.bandnameSelected = {[keys[len - (i + 1)]]: values[len - (i + 1)]}
            }
        }
    }

    /* Stop the wheel if slow enough */
    // Returns true if wheel stopped, false otherwise
    checkAndStopWheel() {

        // WHEEL STOPPED
        if (abs(this.angleV) < this.stopVelocity) {
            
            // Set the clock interval back to resting
            this.clock.set_interval(100)
            this.bn_glow_clock.set_interval(100)
            
            // Stop the wheel
            this.state = this.states.Stopped
            this.angleV = 0;

            // Save the amount of times it rotated then reset 
            this.rotations_final = this.rotations
            this.rotations = 0 

            // Choose the final bandname and return true
            doth_text.css('visibility', 'visible')
            this.chooseBandname();
            return true
        }

        // WHEEL SPINNING 
        doth_text.css('visibility', 'hidden')
        this.chooseBandname();  // Select the current bandname 
        this.pastAngle = this.angle;  // Save the last angle

        /* Speeds up or slows down the clock for the pentagram glow animation */
        if ((this.angleV * 8) == 0) {
            this.clock.set_interval(this.clock.base_interval)
            this.bn_glow_clock.set_interval(this.bn_glow_clock.base_interval)
        } else {
            this.clock.set_interval(this.clock.base_interval / (this.angleV * 10))
            this.bn_glow_clock.set_interval(this.bn_glow_clock.base_interval / (this.angleV * 10))
        }
        
        // Set the state to spinning if not
        if (this.state != this.states.Spinning){
            this.state = this.states.Spinning
        }

        return false
    }

    sumMouseDyDx() {
        let dy = mouseY - pmouseY;
        let dx = -(mouseX - pmouseX);
        if (mouseX <= width/2) {
            dy *= -1; // flip dy if mouse is on the left side of the wheel
        }
        return dy + dx
    }

    /* Main wheel logic, updates the wheel */
    update() {

        // Dragging inside canvas
        if (this.mouseStartedInsideCanvas && mouseIsPressed) {

            // Set the state to Stopped if not and reset the angle velocity
            this.state = this.states.Stopped
            this.angleV = 0;

            // Get change in mouse position X and Y while dragging
            let sumMouseChange = this.sumMouseDyDx()

            // Dampen the speed of the wheel while dragging and update the angle
            let drag_dampener = 0.25 // lower numbers make the wheel spin slower
            this.angle = this.pastAngle + (sumMouseChange * drag_dampener);
            this.pastAngle = this.angle;
        }

        // Rotate the wheel (img) and bandnames
        let dist_from_top = 50
        translate(width/2, dist_from_top);
        rotate(this.angle);
        this.render();
        translate(-width/2, dist_from_top);

        this.slowDownWheel();
        this.checkAndStopWheel();
        this.checkAndResetAngle();

        // Update angle and angle velocity
        if (wheel.angleV > wheel.maxAngleV) {
            if (wheel.angleV > 0) {
                wheel.angleV = wheel.maxAngleV;
            } else {
                wheel.angleV = -wheel.maxAngleV;
            }
        }
        wheel.angle += wheel.angleV;
        wheel.angleV += wheel.angleA;

        // tick the clocks
        this.clock.tick();
        this.bn_glow_clock.tick();
    }

    /* Reset the wheel if angle crosses 360/0 degrees */
    checkAndResetAngle() {

        if (this.angle >= 360) {
            this.pastAngle = 0;
            this.angle = 0;
            this.rotations += 1
        }

        if (this.angle < 0) {
            this.pastAngle = 360;
            this.angle = 360;

            if (this.rotations != 0){
                this.rotations -= 1
            }
        }
    }

    /* Settings for the text */
    setUpTextSettings() {
        textFont(font);
        textSize(12);
        fill(0, 0, 0, 255)
    }

    /* Render the bandnames on the wheel */
    renderBandnames() {

        // Set up the text settings. 
        this.setUpTextSettings();

        if (this.alpha != 255) {
            fill(0, 0, 0, this.alpha)
        }

        // Rotate half the even separator 
        rotate(this.evenSeparatorDeg/2)
        rotate(-10)

        // Space out the bandnames evenly 
        for (var i = 0; i < Object.keys(this.bandnamesOnWheel).length; i++) {

            fill(0, this.angleV * 10, this.angleV * 10)

            // Render with profanity off
            if (profanity_filter == "True"){
                text(Object.values(this.bandnamesOnWheel)[i], this.bandnameSpaceFromCenter, 0, 150, 100)
            }
            // Render with profanity on
            else {
                text(Object.keys(this.bandnamesOnWheel)[i], this.bandnameSpaceFromCenter, 0, 150, 100)
            }

            // Rotate each bandname by the even seperation in degrees
            rotate(this.evenSeparatorDeg)
        }
    }

    fadeInWheel() {
        if (this.alpha != 255){
            this.alpha += 3;
        }
        tint(255, this.alpha);
    }

    /* Render the wheel (ellipse) */
    renderWheel() {

        this.fadeInWheel();

        image(this.wheel_imgs[this.frame_counter], -width/2, -75 - height/2, 500, 500)
        if(this.clock.trigger()){
            this.frame_counter++;
            if (this.frame_counter == 26) {
                this.frame_counter = 0;
            }
        }
        
    }

    /* Calls the other render functions in the proper order */
    render() {
        this.renderWheel();
        this.renderBandnames();
    }

    get_rotations_final() {
        return this.rotations_final
    }
};
