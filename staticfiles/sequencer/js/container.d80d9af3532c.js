class Container {
    constructor(simulation, size, thickness, sides, sideLengthScale, pos) {
        this.simulation = simulation

        this.size = size;           // Size scalar for the centerOffset variable. Determines overall size of container.
        this.thickness = thickness  // thickness of container parts 
        this.pos = pos;             // Center position of container
        this.sides = sides;         // Number of sides

        this.parts = [];              // Parts that make up the container
        this.relativeAngle = 0;       // Shared angle used for rotating the individual parts (not the entire container)
        this.angle = 0                // Current angle of entire container
        this.angleV = 0.01            // Speed of rotation
        this.triangleAdjust = false;  // Triangle adjust. If enabled, gives the 3 sides shape an extra bit of sideLength. Side effect of how I calculate sideLength.

        this.centerOffset = this.pos.x - this.size * 25         // Center offset that determines the overall size of the container
        this.sideLength = this.pos.x - this.centerOffset  // The length of one side. Generated from the calculating the (distance from the center to the offset * 2)
        this.sideLengthScale = sideLengthScale                  // A scalar for the length of the sides. ( 1.0 = 100% length, 0.1 = 10% length)
        
        this.setup();
    }

    setup() {
        this.generateShape();
    }

    draw() {
        for (const part of this.parts) {
            var pos = part.position;
            var angle = part.angle;

            push();
            fill("white")
            noStroke()
            translate(pos.x, pos.y)
            rotate(angle)
            rect(0, 0, this.thickness, this.triangleAdjust ?  (this.sideLength * 2) * this.sideLengthScale * 1.75: (this.sideLength * 2) * this.sideLengthScale, 20)
            pop();
        }
    }

    update() {
        for (const part of this.parts) {
            /* Rotate container around the center point */
            Body.rotate(part, this.angle + this.angleV, createVector(this.pos.x, this.pos.y))
        }
    }

    updateSideLength(newSideLength) {
        this.sideLengthScale = newSideLength
        this.generateShape();
    }

    updateSize(newSize) {
        this.size = newSize;
        this.centerOffset = this.pos.x - this.size * 25
        this.sideLength = this.pos.x - this.centerOffset
        this.generateShape();
    }

    updateSides(newSides) {
        this.sides = newSides;

        if (this.sides == 3) {
            this.triangleAdjust = true
        } else {
            this.triangleAdjust = false
        }
        this.generateShape();
    }

    updateOpenness(newOpenness) {
        this.relativeAngle = newOpenness;
        this.generateShape();
    }

    generateShape() {
        var regen = false;
        var prevAngles = []

        if (this.parts.length != 0) {
            regen = true;
            for (let i = 0; i < this.parts.length; i++) {
                prevAngles.push(this.parts[i].angle)
            }
            Composite.remove(this.simulation.world, this.parts)
            this.parts = []
            const prevAngles = prevAngles.filter(function (value) {
                return !Number.isNaN(value);
            });
        } 

        

        var angleDiv = 360 / this.sides

        for (let i = 0; i < this.sides; i++) {
            
            let newAngle = i * angleDiv
            this.parts.push(
                Bodies.rectangle(
                    this.centerOffset , this.pos.y,
                    this.thickness, this.triangleAdjust ? (this.sideLength * 2) * this.sideLengthScale * 1.75 : (this.sideLength * 2) * this.sideLengthScale,
                    {
                        isStatic: true,
                        friction: 0,
                        restitution: 1,
                    }

                )
            )
            Body.rotate(this.parts[i], regen ? prevAngles[i] : radians(newAngle), createVector(this.pos.x, this.pos.y))

            /* Rotate for Openness factor */
            Body.rotate(this.parts[i], this.relativeAngle)

        }
        Composite.add(this.simulation.world, this.parts);
    }


}