class MIDI_Message {
    constructor(data) {
        /*
        data is Uint8Array[3] with
        data[0] : command/channel
        data[1] : note
        data[2] : velocity
        */
        this.cmd = data[0] >> 4;
        this.channel = data[0] & 0xf; // 0-15
        this.type = data[0] & 0xf0;
        this.note = data[1];
        this.velocity = data[2];
        if (this.velocity == 0) {
            this.type = MIDI_Message.NOTE_OFF;
        } else {
            this.type = MIDI_Message.NOTE_ON;
        }
        this.toString = function () {
            return 'type=' + this.type +
                ' channel=' + this.channel +
                ' note=' + this.note +
                ' velocity=' + this.velocity;
        };
    }
}
MIDI_Message.NOTE_ON = 144;
MIDI_Message.NOTE_OFF = 128;

class MIDIOutput {
    
    constructor(simulation) {
        this.simulation = simulation
        this.MIDIOut = WebMidi.outputs[0];          // MIDI output device
        this.MIDIOutList = [];

        // request MIDI access
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({sysex: false});
        } else {
            alert("No MIDI support in your browser.");
        }
    }

    playNote(note) {
        this.MIDIOut.playNote(note, {attack: 1, duration: 100});
    }

    changeMIDIOut() {
        this.MIDIOut = WebMidi.getOutputByName(this.simulation.gui.gui.getValue("MIDI Output Device"));
    }
}

class MIDIInput {

    constructor(simulation) {
        this.simulation = simulation;
        this.MIDIIn = null;
        this.MIDIIn_selector = null;
        this.MIDIInList = [];

        // request MIDI access
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false});
        } else {
            alert("No MIDI support in your browser.");
        }
    }

    /* Returns the note played */
    noteOn(e) {
        this.simulation.createCircle(createVector(mouseX, mouseY), e.note.identifier);
    }

    changeMIDIIn() {
        let val = this.MIDIIn_selector.value();
        this.MIDIIn.removeListener();
        this.MIDIIn = WebMidi.getInputByName(val);
        this.MIDIIn.addListener("noteon", this.noteOn.bind(this));
    }
}
