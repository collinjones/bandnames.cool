/* p5 static/p5/wheel/wheel.js - class file containing the bandnames wheel */

var doth_text;
var genreElement;
p5.disableFriendlyErrors = true;

class Wheel {

    constructor(color, bandnames, wheel_imgs, bandnameSelectedHeading) {

        this.wheel_imgs = wheel_imgs;
        this.frame_counter = 0;

        /* Misc. attributes */
        this.states = { Stopped: "stopped", Spinning: "spinning", Initial: "initial" }  // States that the wheel can be in

        /* Bandname & Line settings */
        this.bandnames = bandnames           // Pool of bandnames to choose from
        this.bandnamesOnWheel = {}           // list of bandnames currently on the wheel
        this.bandnameSpaceFromCenter = 75;   // The amount of pixels from the center that the bandname is rendered
        this.bandnameSelected = {};          // current bandname selected
        this.previousBandnameSelected = {};  // previous frame bandname
        this.evenSeparatorDeg;               // The ammount in degrees that evenly separates elements in the wheel
        this.evenSepDiv2;
        this.previousSegmentIndex = null;
        this.bandnameSelectedHeading = bandnameSelectedHeading;
        this.halfWidth = width/2;
        this.halfHeight = height/2;
        this.drag_dampener = 0.25; // lower numbers make the wheel spin slower

        /* Wheel settings */
        this.stopVelocity = 0.10;          // lower numbers stop the wheel at a higher velocity
        this.slower_velocity_threshold = 0.50;
        this.slowRate = -0.01;             // lower numbers slow the wheel faster
        this.angle = 0;                    // initial angle of wheel
        this.pastAngle = 0;                // previous frame angle
        this.angleV = 0.0;                 // initial angle velocity
        this.maxAngleV = 40;               // initial max angle velocity
        this.angleA = 0;                   // initial angle acceleration
        this.color = color;                // color of the wheel 
        this.state = this.states.Initial;  // initial state of the wheel
        this.rotations = 0;
        this.rotations_final = 0;
        this.alpha = 0;
        this.mouseVector = createVector(0, 0);

        // Clocks
        this.randomStringGenerationClock = new Clock(50);
        this.clock = new Clock(100);
        this.bn_glow_clock = new Clock(100);

        // flags
        this.stopActionsExecuted = false;
        this.spinActionsExectued = false;
        this.isDragging = false;
        this.bandnameChangeProcessed = false;
        this.mouseStartedInsideCanvas = false;
        this.genreRequestMade = false;
        
        this.populateWheel();
    }

    /* Main wheel logic, updates the wheel */
    update() {
        this.handleCanvasDrag();
        this.handleSpinning();
        this.limitAngleVelocity();

        this.adjustPentagramAnimationSpeed();
        this.stopWheelIfNecessary();
        this.updateClocks();
        this.rotateWheel();
    }

    updateRotation() {
        this.angle += this.angleV;
        this.angleV += this.angleA;
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
        const cleaned_bandnames = this.replace_char_codes(keys, values)
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
        this.evenSepDiv2 = this.evenSeparatorDeg/2
    }

    isStopped() {
        return this.state == this.states.Stopped;
    }
    
    isSpinning() {
        return this.state == this.states.Spinning;
    }

    inInitialState() {
        return this.state == this.states.Initial;
    }

    handleSpinning() {

        if (this.isStopped() || this.inInitialState()) {
            return; 
        }

        // Handle these actions each frame
        this.handleAngleBounds();
        this.gibberishHandler();
        this.slowDownWheel();
        this.updateRotation();
        this.pastAngle = this.angle; 
        this.stopActionsExecuted = false;

        // Handle these actions once per bandname change
        if (this.bandnameSelectedChanged()) {
            tick_sfx.play();
        }

        // Handle these actions once per spin
        if (!this.spinActionsExectued) {
            this.hideDothText();
            this.disableFormElements();
            this.spinActionsExectued = true;
        }

    }

    gibberishHandler() {
        if (this.randomStringGenerationClock.trigger()) {
            const gibber = `${this.generateRandomString(10)} ${this.generateRandomString(10)}`;
            this.updateSelectedItemHeader(gibber)
        }
    }

    disableFormElements() {
        const formElements = $('.disable-group')
        this.disableElement(formElements);
    }
    
    enableFormElements() {
        const formElements = $('.disable-group')
        this.enableElement(formElements);
    }

    // Apply the slow down rate to the wheel
    slowDownWheel() {
        this.angleV += this.angleV * this.slowRate;
    }

    chooseBandname() {
        const keys = Object.keys(this.bandnamesOnWheel);
        const values = Object.values(this.bandnamesOnWheel);
        
        // Calculate the index of the selected bandname based on the current angle
        const selectedIndex = Math.floor(this.angle / this.evenSeparatorDeg) % keys.length;
    
        // Adjust index for reverse order, as per original logic
        const adjustedIndex = keys.length - 1 - selectedIndex;
    
        // Create the newSelectedBandname object
        const newSelectedBandname = { [keys[adjustedIndex]]: values[adjustedIndex] };
    
        // Update the selected bandname and reset the change processed flag
        this.previousBandnameSelected = this.bandnameSelected;
        this.bandnameSelected = newSelectedBandname;
        this.bandnameChangeProcessed = false;
    }

    objectsEqual(obj1, obj2) {
        return Object.keys(obj1)[0] == Object.keys(obj2)[0];
    }
    
    bandnameSelectedChanged() {
        const currentSegmentIndex = Math.floor(this.angle / this.evenSeparatorDeg) % 8;
        if (this.previousSegmentIndex != currentSegmentIndex) {
            this.previousSegmentIndex = currentSegmentIndex;
            return true;
        }
        return false;
    }
    
    isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }

    stopWheel() {
        this.angleV = 0;
        this.setState(this.states.Stopped)
    }

    stopWheelIfNecessary() {
        const necessaryToStopWheel = (this.isBelowStopVelocity(this.angleV, this.stopVelocity) && this.state != this.states.Initial) && !this.stopActionsExecuted;
        if (necessaryToStopWheel) {
            this.handleBandnameSelection();
            this.stopActionsExecuted = true;
        }
    }
    
    handleBandnameSelection() {
        tick_sfx.play();
        this.chooseBandname();
        this.updateSelectedBandnameHeader();
        this.getGenresForBandname();
        this.showDothText();
        this.enableFormElements();
        this.resetWheelState();
        this.pastAngle = this.angle;
        this.spinActionsExectued = false;
    }

    hasPreviousBandnameSelected() {
        return Object.keys(this.previousBandnameSelected).length > 0;
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
        // Resets clocks back to their default intervals
        
        this.clock.resetInterval()
        this.bn_glow_clock.resetInterval()
    }

    resetWheelState() {
        this.resetClocks()
        this.rotations_final = this.rotations
        this.angleV = 0;
        this.rotations = 0 
        this.state = this.states.Stopped;
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
        
        const mouseOnLeftSide = mouseX <= width/2;
        if (mouseOnLeftSide) {
            dy *= -1; // flip dy if mouse is on the left side of the wheel
        }
        return dy + dx;
    }

    rotateWheel() {
        const dist_from_top_pixels = 50;
        translate(width/2, dist_from_top_pixels);
        rotate(this.angle);
        this.render();
        translate(-width/2, dist_from_top_pixels);
    }

    updateClocks() {
        // tick the clocks
        this.clock.tick();
        this.bn_glow_clock.tick();
        this.randomStringGenerationClock.tick();
    }

    sumDyDx(x, y) {
        const dy = (mouseX <= width / 2 ? -1 : 1) * (x - pmouseY);
        const dx = -(y - pmouseX);
        return dy + dx;
    }

    handleCanvasDrag() {
        if (this.mouseStartedInsideCanvas && mouseIsPressed) {

            this.stopWheel();
 
            // Handle actual mouse dragging logic
            const sumMouseChange = this.sumDyDx(mouseY, mouseX);
            const mouseDragged = this.isDragging || sumMouseChange !== 0
            if (mouseDragged) {

                // Choose a new bandname if a new segment is selected
                if (this.bandnameSelectedChanged()) {
                    this.handleBandnameSelection();
                }
    
                // Handles dragging on touch devices 
                const touchDevice = isTouchDevice() && !this.isDragging
                if (touchDevice) {
                    this.angle = this.pastAngle
                } else {
                    this.angle = this.pastAngle + (sumMouseChange * this.drag_dampener);
                }

                this.handleAngleBounds(); // Ensure the angle stays within bounds
                this.mouseVector.set(pmouseX - this.halfWidth, pmouseY - this.halfHeight);
                this.pAngle = this.mouseVector.heading();
            }
            
            this.pastAngle = this.angle;

        } else if (this.isDragging) {
            this.isDragging = false;
        }
        
    }

    updateSelectedBandnameHeader() {
        const [bandnameKey, bandnameValue] = Object.entries(this.bandnameSelected)[0];
        const rgb = getRandomRGB();
        const displayValue = profanity_filter === "True" ? bandnameValue : bandnameKey;
        const spanElement = document.createElement("span");
        spanElement.style.color = `rgb(${rgb})`;
        spanElement.textContent = displayValue;
        this.bandnameSelectedHeading.innerHTML = "";
        this.bandnameSelectedHeading.appendChild(spanElement);
        this.bandnameSelectedHeading.setAttribute("value", bandnameKey);
    }

    updateSelectedItemHeader(str) {
        const rgb = getRandomRGB();
        const displayValue = str
        const spanElement = document.createElement("span");
        spanElement.style.color = `rgb(${rgb})`;
        spanElement.textContent = displayValue;
        this.bandnameSelectedHeading.innerHTML = "";
        this.bandnameSelectedHeading.appendChild(spanElement);
        this.bandnameSelectedHeading.setAttribute("value", str);
    }


    adjustPentagramAnimationSpeed() {
        /* Speeds up or slows down the clock for the pentagram glow animation */

        // if ((this.angleV * 8) == 0) {
        //     this.clock.mutableInterval = this.clock.base_interval
        //     this.bn_glow_clock.mutableInterval = this.bn_glow_clock.base_interval
        // } else {
        //     this.clock.mutableInterval = this.clock.base_interval / (this.angleV * 10)
        //     this.bn_glow_clock.mutableInterval = this.bn_glow_clock.base_interval / (this.angleV * 10)
        // }
    }

    limitAngleVelocity() {

        // Update angle and angle velocity
        if (this.angleV > this.maxAngleV) {
            if (this.angleV > 0) {
                this.angleV = this.maxAngleV;
            } else {
                this.angleV = -this.maxAngleV;
            }
        }
    }

    /* Reset the wheel if angle crosses 360/0 degrees */
    handleAngleBounds() {
        this.angle = ((this.angle % 360) + 360) % 360;
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
        rotate(this.evenSepDiv2)
        rotate(-10)
        
        const num_bandnames = Object.keys(this.bandnamesOnWheel).length
        if (profanity_filter == "True") {
            this.drawBandnamesOnWheel(Object.values(this.bandnamesOnWheel), num_bandnames)
        } else {
            this.drawBandnamesOnWheel(Object.keys(this.bandnamesOnWheel), num_bandnames)
        }
    }

    drawBandnamesOnWheel(bandnames, num_bandnames) {
        for (var i = 0; i < num_bandnames; i++) {
            text(bandnames[i], this.bandnameSpaceFromCenter, 0, 150, 100)
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
        this.setState(this.states.Spinning)
    }

    /* Calls the other render functions in the proper order */
    render() {
        this.renderWheel();
        this.renderBandnames();
    }

    get_rotations_final() {
        return this.rotations_final
    }

    bandnameIsSelected() {
        return !this.isEmptyObject(this.bandnameSelected)
    }

    getRandomLetter() {
        const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    generateRandomString(length) {
        let result = [];
        for (let i = 0; i < length; i++) {
            result.push(this.getRandomLetter());
        }
        return result.join('');
    }    
    
};
