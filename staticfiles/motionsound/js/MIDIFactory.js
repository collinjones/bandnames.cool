class MIDIFactory {
    constructor() {
        this.noteNames = {
            "C": 24, 
            "C#": 25, 
            "D": 26, 
            "D#": 27, 
            "E": 28, 
            "F": 29, 
            "F#": 30, 
            "G": 31, 
            "G#": 32, 
            "A": 33, 
            "A#": 34, 
            "B": 35,
        }
        this.ionian = [2, 2, 1, 2, 2, 2, 1];
        this.dorian = [2, 1, 2, 2, 2, 1, 2];
        this.phrygian = [1, 2, 2, 2, 1, 2, 2];
        this.lydian = [2, 2, 2, 1, 2, 2, 1];
        this.mixolydian = [2, 2, 1, 2, 2, 1, 2];
        this.aeolian = [2, 1, 2, 2, 1, 2, 2];
        this.locrian = [1, 2, 2, 1, 2, 2, 2];
        this.natural_minor = [2, 1, 2, 2, 1, 2, 2];
        this.harmonic_minor = [2, 1, 2, 2, 1, 3, 1];
        this.melodic_minor = [2, 1, 2, 2, 2, 2, 1];
        this.custom_mode = [];

        this.modes = {
            "Ionian": this.ionian, 
            "Dorian": this.dorian,
            "Phrygian": this.phrygian,
            "Lydian": this.lydian,
            "Mixolydian": this.mixolydian,
            "Aeolian": this.aeolian,
            "Locrian": this.locrian,
            "Natural Minor": this.natural_minor,
            "Harmonic Minor": this.harmonic_minor,
            "Melodic Minor": this.melodic_minor,
            "Custom Mode": this.custom_mode,
        }

        this.currentMode = this.ionian;  /* Default mode */
        this.currentNoteNumbers = [];  // Array of midi values in the current mode
        this.currentNoteNames = [];  // Array of note names & octaves in the current mode
        this.root = 24;  // C
    }

    deriveMode() {
        this.currentNoteNames = [];
        this.currentNoteNumbers = [];
        
        var j = 0;
        for (let i = this.root; i < 85; i++) {
            if(i != this.root) {
                let q = j % this.currentMode.length
                let final_val = this.currentNoteNumbers[this.currentNoteNumbers.length - 1] + this.currentMode[q]
                this.currentNoteNumbers.push(final_val)
                j++;
        
            /* Push first note */
            } else {
                this.currentNoteNumbers.push(i);
            }
        }
        this.currentNoteNumbers = this.currentNoteNumbers.slice(
            floor(this.currentNoteNumbers.length / 7), 
            floor(this.currentNoteNumbers.length / 7) + 7
        )
        this.MIDIToName();
    }

    MIDIToName() {
        for (let i = 0; i < this.currentNoteNumbers.length; i++){
            let noteInOctave = this.currentNoteNumbers[i] % 12;
            let octave = this.currentNoteNumbers[i] / 12;
            let notes = Object.keys(this.noteNames)
            if (notes[noteInOctave] == "A" || notes[noteInOctave] == "B") {
                octave = ceil(octave)
            } else {
                octave = floor(octave)
            }
            this.currentNoteNames.push(notes[noteInOctave] + octave)
        }
    }

    setNewMode(newMode) {
        this.currentMode = newMode;
        this.deriveMode();
    }

    setNewRoot(newRoot) {
        this.root = this.noteNames[newRoot];
        this.deriveMode();
    }

    generateRandomNoteName() {
        return this.currentNoteNames[Math.floor(Math.random() * this.currentNoteNames.length)];
    }

}