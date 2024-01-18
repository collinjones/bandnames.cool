/* p5 static/p5/wheel/wheel.js - class file containing the bandnames wheel */

var doth_text;
var genreElement;

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
        this.genreRequestMade = false;
        this.wheelStopActionsExecuted = false;
        this.populateWheel();
    }

    /* Main wheel logic, updates the wheel */
    update() {

        this.handleCanvasDrag();
        this.rotateWheel();
        this.adjustPentagramAnimationSpeed();
        this.handleSpinning();
        this.stopWheelIfNecessary();
        this.handleAngleBounds();
        this.handleAngleVelocity();

        
        this.angle += this.angleV;
        this.angleV += this.angleA;

        this.updateClocks();
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

    setState(state) {
        this.state = state;
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
    handleSpinning() {
        if (abs(this.angleV) > this.stopVelocity) {
            this.wheelStopActionsExecuted = false;
            this.setState(this.states.Spinning)

            this.hideDothText();

            var formElements = $('.form-element')
            this.disableElement(formElements);

            // Slow the wheel down
            this.angleV += this.angleV * this.slowRate;
            this.chooseBandname();  // Select the current bandname 
            this.pastAngle = this.angle;  // Save the last angle
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

    stopWheelIfNecessary(override = false) {

        const canStopWheel = this.isBelowStopVelocity(
            this.angleV, this.stopVelocity
        ) || override

        if(Object.keys(this.previousBandnameSelected)[0] != Object.keys(this.bandnameSelected)[0]) {
            updateBandnameDisplay();
            this.wheelStopActionsExecuted = false;
        }

        // WHEEL STOPPED
        if (canStopWheel && !this.wheelStopActionsExecuted) {
            this.wheelStopActionsExecuted = true;
            this.resetWheelState();
            this.showDothText();
            this.chooseBandname();

            if(Object.keys(this.previousBandnameSelected)[0]) {
                var formElements = $('.form-element')
                this.enableElement(formElements);
            }

            // Fire a custom event to request the genres for the bandname
            if(Object.keys(this.bandnameSelected).length != 0) {
                this.getGenresForBandname();
            }
        }
    }

    getGenresForBandname() {
        var getGenres = new CustomEvent('getGenresForBandname');
        window.dispatchEvent(getGenres);
    }

    disableElement(element) {
        element.prop('disabled', true);
    }
    enableElement(element) {
        element.prop("disabled", false)
    }

    isBelowStopVelocity(currentVelocity, thresholdVelocity) {
        return Math.abs(currentVelocity) < thresholdVelocity;
    }

    resetClocks() {
        this.clock.reset_interval()
        this.bn_glow_clock.reset_interval()
    }

    resetWheelState() {
        this.resetClocks()
        this.state = this.states.Stopped
        this.rotations_final = this.rotations
        this.angleV = 0;
        this.rotations = 0 
    }

    showDothText() {
        doth_text.css('visibility', 'visible')
    }

    hideDothText() {
        doth_text.css('visibility', 'hidden')
    }

    sumMouseDyDx() {
        let dy = mouseY - pmouseY;
        let dx = -(mouseX - pmouseX);
        if (mouseX <= width/2) {
            dy *= -1; // flip dy if mouse is on the left side of the wheel
        }
        return dy + dx
    }

    rotateWheel() {
        // Rotate the wheel (img) and bandnames
        let dist_from_top = 50
        translate(width/2, dist_from_top);
        rotate(this.angle);
        this.render();
        translate(-width/2, dist_from_top);
    }

    updateClocks() {
        // tick the clocks
        this.clock.tick();
        this.bn_glow_clock.tick();
    }

    handleCanvasDrag() {

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
            this.chooseBandname();
        }
    }

    adjustPentagramAnimationSpeed() {
        /* Speeds up or slows down the clock for the pentagram glow animation */

        if ((this.angleV * 8) == 0) {
            this.clock.set_interval(this.clock.base_interval)
            this.bn_glow_clock.set_interval(this.bn_glow_clock.base_interval)
        } else {
            this.clock.set_interval(this.clock.base_interval / (this.angleV * 10))
            this.bn_glow_clock.set_interval(this.bn_glow_clock.base_interval / (this.angleV * 10))
        }
    }

    handleAngleVelocity() {
        // Update angle and angle velocity
        if (this.angleV > this.maxAngleV) {
            if (this.angleV > 0) {
                this.angleV = this.maxAngleV;
            } else {
                this.angleV = -this.maxAngleV;
            }
        }
    }

    resetAngle(angle) {
    }

    /* Reset the wheel if angle crosses 360/0 degrees */
    handleAngleBounds() {

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

    spin(aV) {
        this.angleV = aV;
        this.state = this.states.Spinning;
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
