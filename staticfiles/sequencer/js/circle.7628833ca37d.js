// A - Yellows
var a_nat = [255, 255, 10];
var a_flat = [173, 179, 7];
var a_sharp = [111, 115, 3];

// B - Oranges
var b_nat = [253, 128, 8];
var b_flat = [180, 94, 7];
var b_sharp = [111, 60, 3];

// C - Reds
var c_nat = [251, 2, 7];
var c_flat = [184, 8, 6];
var c_sharp = [107, 9, 3];

// D - Greens
var d_nat = [128, 255, 8];
var d_flat = [95, 187, 6];
var d_sharp = [61, 116, 3];

// E - Light Blues
var e_nat = [33, 255, 255];
var e_flat = [23, 182, 182];
var e_sharp = [14, 112, 112];

// F - Dark Blues
var f_nat = [15, 128, 255];
var f_flat = [11, 91, 179];
var f_sharp = [6, 58, 111];

// G - Purples
var g_nat = [251, 2, 255];
var g_flat = [174, 6, 177];
var g_sharp = [109, 10, 111];

class Circle {
    constructor(simulation, x, y, r, note, fric, rest) {
        this.simulation = simulation; 
        var options = {
            friction: fric,
            restitution: rest,
            frictionAir: 0,
            frictionStatic: 0,
            inertia: Infinity
        }
        this.r = r;
        this.MIDI_note = note;
        this.body = Bodies.circle(x, y, r, options);
        this.vel = this.body.velocity;
        this.color = null;
        this.constant_color = null;
        
        this.setup();
    }

    setup() {
        this._setColor();
        Composite.add(this.simulation.world, this.body);
    }

    collisionEvent() {
        this.simulation.MIDIOut_controller.playNote(this.MIDI_note);
    }

    draw() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        fill(this.color)
        noStroke();
        smooth();
        translate(pos.x, pos.y)
        rotate(angle)
        ellipse(0, 0, this.r * 2, this.r * 2)
        pop();
    }

    hover() {
        this.color = color(255, 255, 255)
    }

    unHover() {
        this.color = this.static_color;
    }

    getVel() {
        return this.vel
    }

    getMag() {
        return sqrt(pow(this.vel.x, 2) + pow(this.vel.y, 2))
    }

    /* Checks if circle has left window bounds */
    checkIfOutsideBounds() {
        if (this.body.position.x < 0 || this.body.position.x > width ||
            this.body.position.y < 0 || this.body.position.y > height) {
                return true;
            }
        return false;
    }

    /* Sets the color of the circle depending on the note */
    _setColor() {
        let note_sliced = this.MIDI_note.slice(0, -1);

        if (note_sliced == "A") {
            this.color = color(a_nat);
        } else if (note_sliced == "A#") {
            this.color = color(a_sharp);
        }

        if (note_sliced == "B") {
            this.color = color(b_nat);
        } else if (note_sliced == "B#") {
            this.color = color(b_sharp);
        }

        if (note_sliced == "C") {
            this.color = color(c_nat);
        } else if (note_sliced == "C#") {
            this.color = color(c_sharp);
        }

        if (note_sliced == "D") {
            this.color = color(d_nat);
        } else if (note_sliced == "D#") {
            this.color = color(d_sharp);
        }

        if (note_sliced == "E") {
            this.color = color(e_nat);
        } else if (note_sliced == "E#") {
            this.color = color(e_sharp);
        }

        if (note_sliced == "F") {
            this.color = color(f_nat);
        } else if (note_sliced == "F#") {
            this.color = color(f_sharp);
        }

        if (note_sliced == "G") {
            this.color = color(g_nat);
        } else if (note_sliced == "G#") {
            this.color = color(g_sharp);
        }
        this.static_color = this.color;
        if (this.color == null) {
            console.log('color was not set for', this.MIDI_note)
        }
    }
}