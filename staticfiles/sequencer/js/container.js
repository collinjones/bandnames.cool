class Container {
    constructor(simulation, size, thickness, sides, sideLengthScale, pos, id, aV) {
        this.simulation = simulation   // Reference to simulation
        this.color = "white";          // Color of container

        this.size = size;              // Size scalar for the centerOffset variable. Determines overall size of container.
        this.thickness = thickness/2;  // thickness of container parts 
        this.pos = pos;                // Center position of container
        this.sides = sides;            // Number of sides
        this.container = null;         // Matter.js composite 
        this.id = id                   // Container ID

        this.parts = [];                // Parts that make up the container
        this.currentOpennessScale = 1;  // Shared angle used for rotating the individual parts (not the entire container)
        this.angle = 0                  // Current angle of entire container
        this.angleV = aV                // Speed of rotation
        this.triangleAdjust = false;    // Triangle adjust. If enabled, gives the 3 sides shape an extra bit of sideLength. Side effect of how I calculate sideLength.
        this.sideLengthScale = sideLengthScale             // A scalar for the length of the sides. ( 1.0 = 100% length, 0.1 = 10% length)
    
        this.generateShape();
    }

    draw() {
        for (const part of this.parts) {
            var pos = part.position;
            var angle = part.angle;
            push();
            fill(this.color)
            noStroke()
            translate(pos.x, pos.y)
            rotate(angle)
            rect(0, 0, 
                this.thickness, 
                this.triangleAdjust ? (this.sideLength * 2) * this.sideLengthScale*2: (this.sideLength * 2) * this.sideLengthScale, 20)
            pop();
        }
    }

    update() {
        for (const part of this.parts) {
            /* Rotate container around the center point */
            Body.rotate(part, this.angle + this.angleV, this.pos)
        }
    }

    updateSideLength(newSideLength) {
        this.sideLengthScale = newSideLength
        this.generateShape();
    }

    updateSize(newSize) {
        this.size = newSize;

        /* Calculate new center offset */
        this.centerOffset = this.pos.x - this.size * 25

        /* Calculate new side length */
        this.sideLength = this.pos.x - this.centerOffset

        /* Generate the new shape */
        this.generateShape();
    }

    updatePosition(newPos) {
        this.pos = newPos;
        this.generateShape();
    }

    setSideThickness(newThickness) {
        this.thickness = newThickness;
        this.generateShape();
    }

    updateSides(newSides) {
        this.sides = newSides;

        if (this.sides == 3) {
            this.triangleAdjust = true;
        } else {
            this.triangleAdjust = false
        }

        /* Add some algorithm to reduce side length when sides > 4 and increase when sides < 4. */
        this.generateShape();
    }

    updateContainerSpeed(newSpeed) {
        this.angleV = newSpeed
    }

    removeFromWorld() {
        if(this.container) {
            Composite.remove(this.simulation.world, this.container);
        }
    }

    generateShape() {

        this.centerOffset = this.pos.x - this.size * 25;   // Center offset that determines the overall size of the container
        this.sideLength = this.pos.x - this.centerOffset;  // The length of one side. Generated from the calculating the (distance from the center to the offset * 2)

        var regen = false;
        var prevAngle = 0;
        var angleDiv = 360 / this.sides

        /* Capture previous angle of first part */
        if (this.parts.length != 0) {
            regen = true;
            prevAngle = this.parts[0].angle;
        }

        this.parts = []

        this.removeFromWorld();

        for (let i = 0; i < this.sides; i++) {
            const newAngle = radians(i * angleDiv)

            this.parts.push(
                Bodies.rectangle(
                    this.centerOffset, this.pos.y,
                    this.thickness, 
                    this.triangleAdjust ? (this.sideLength * 2) * this.sideLengthScale*2 : (this.sideLength * 2) * this.sideLengthScale,
                    {
                        isStatic: true,
                    }
                )
            )
            Body.rotate(this.parts[i], newAngle, this.pos);
        }

        this.container = Composite.create({
            bodies: this.parts,
        });

        /* If regenerating, rotate entire composite to previous angle */
        if (regen) {
            Composite.rotate(this.container, prevAngle, this.pos);
        }

        Composite.add(this.simulation.world, this.container);
        
        for (const part of this.parts) {
            part.restitution = 0.99;
            part.friction = 0;
            part.frictionStatic = 0;
            part.frictionAir = 0;
            part.slop = 0;
        }
    }

    selected() {
        this.color = color(134, 255, 130);

        if (mouseIsPressed) {
            this.pos = createVector(mouseX, mouseY)
        }

    }

    unselected() {
        this.color = "white"
    }

}