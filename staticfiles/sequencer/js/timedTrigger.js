/* TimedTrigger acts as a countdown timer 
    that can trigger an event at each pulse */

class TimedTrigger {

    constructor(interval) {
        this._current_time = millis();     // Keeps track of current time
        this._last_reset = millis();       // Keeps track of time since last reset
        this._interval = interval * 1000;  // Interval between executions
        this._first_execution = true;      // Bool to allow for a first execution 
        this._countdown = this._interval;
    }

    // Update current time
    _tick() {  
        this._current_time = millis();
    }

    // Save the time of reset
    _reset() {
        this._last_reset = millis();
    }

    update() {
        this._tick();
    }

    getTimeUntilExecution() {
        let time_since_reset = this._current_time - this._last_reset
        return this._countdown - time_since_reset;
    }

    /* Returns true if time has elapsed beyond interval, false otherwise */
    canExecute() {
        if (this._current_time - this._last_reset > this._interval || this._first_execution) {
            this._reset()
            this._first_execution = false;
            return true
        }
        this._tick()
        return false
    }
}