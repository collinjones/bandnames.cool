class Clock {
    constructor(interval) {
        this.clock_started = millis();
        this.last_trigger = millis();
        this.current_time = millis();
        this.immutable_interval = interval;
        this.mutable_interval = this.base_interval ;
    }

    reset_interval() {
        this.mutable_interval = this.base_interval;
    }

    get_interval() {
        return this.mutable_interval;
    }

    /* Sets the clock interval with a conversion from millis to sec */
    set_interval(new_interval) {
        this.mutable_interval = new_interval;
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
        if (this.current_time - this.last_trigger > this.mutable_interval) {
            this.reset_trigger();
            return true;
        }
        return false;
    }
}