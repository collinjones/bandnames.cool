class Container {
    constructor(simulation, size, thickness, sides, sideLengthScale, pos) {
        this.simulation = simulation

        this.size = size;           // Size scalar for the centerOffset variable. Determines overall size of container.
        this.thickness = thickness  // thickness of container parts 
        this.pos = pos;             // Center position of container
        this.sides = sides;         // Number of sides
        this.container = null;

        this.parts = [];              // Parts that make up the container
        this.currentAngle = 1;       // Shared angle used for rotating the individual parts (not the entire container)
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
        this.generateShape();
    }

    updateOpenness(newOpenness) {
        this.currentAngle = newOpenness
        for (const part of this.parts) {
            // let newAngle = part.angle * this.currentAngle
            Body.setAngle(part, part.angle + 25)
        }
    }

    removeFromWorld() {
        if(this.container) {
            Composite.remove(this.simulation.world, this.container);
        }
    }

    generateShape() {

        var regen = false;
        var prevAngle = 0;

        if (this.parts.length != 0) {
            regen = true;
            prevAngle = this.parts[0].angle
        }

        this.removeFromWorld();

        if(this.container) {
            Composite.remove(this.simulation.world, this.container);
        }

        this.parts = []
        var angleDiv = 360 / this.sides

        for (let i = 0; i < this.sides; i++) {
            var newAngle = radians(i * angleDiv)

            this.parts.push(
                Bodies.rectangle(
                    this.centerOffset , this.pos.y,
                    this.thickness, (this.sideLength * 2) * this.sideLengthScale,
                    {
                        isStatic: true,
                        friction: 0,
                        restitution: 1,
                    }

                )
            )
            Body.rotate(this.parts[i], newAngle, this.pos);

        }

        this.container = Composite.create({
            bodies: this.parts,
        });

        

        /* If regenerating, return composite to previous angle */
        if (regen) {
            Composite.rotate(this.container, prevAngle, this.pos);
        }

        Composite.add(this.simulation.world, this.container);
    }


}