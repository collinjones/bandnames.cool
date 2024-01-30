class Clock {
    constructor(interval_ms) {
        this.clockStarted = millis();
        this.lastTrigger = this.clockStarted;
        this.currentTime = this.clockStarted;
        this.immutableInterval = interval_ms;
        this.mutableInterval = interval_ms;
    }

    resetInterval() {
        this.mutableInterval = this.immutableInterval;
    }

    get interval() {
        return this.mutableInterval;
    }

    // Convert seconds to milliseconds and set the interval
    set interval(newIntervalSec) {
        if (typeof newIntervalSec !== 'number') {
            throw new Error('Interval must be a number');
        }
        this.mutableInterval = newIntervalSec * 1000; // Converting seconds to milliseconds
    }
    
    // Update the clock
    tick() {
      this.currentTime = millis(); // Update the current time
    }
    
    // Resets the time since last trigger
    resetTrigger() {
      this.lastTrigger = millis();
    }
    
    // Checks if the interval has passed since the last trigger
    trigger() {
        if (this.currentTime - this.lastTrigger > this.mutableInterval) {
            this.resetTrigger();
            return true;
        }
        return false;
    }
}
