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

    set interval(newIntervalSec) {
        if (typeof newIntervalSec !== 'number') {
            throw new Error('Interval must be a number');
        }
        this.mutableInterval = newIntervalSec * 1000;
    }
    
    tick() {
        this.currentTime = millis();
    }
    
    resetTrigger() {
        this.lastTrigger = millis();
    }
    
    trigger() {
        if (this.currentTime - this.lastTrigger > this.mutableInterval) {
            this.resetTrigger();
            return true;
        }
        return false;
    }
}