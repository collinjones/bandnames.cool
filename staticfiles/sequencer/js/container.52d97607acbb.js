class Container {
    constructor(simulation, size, width, sides, pos) {
        this.simulation = simulation

        this.size = size;
        this.width = width
        this.pos = pos;
        this.sides = sides;

        this.parts = [];
        this.angle = 0
        this.angleV = 0.0
        this.centerOffset = this.pos.x - size / 2
        this.sideLength = this.centerOffset * -1
        console.log(this.sideLength)
        this.scaleFactor = 0;
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
            rect(0, 0, this.width / 2, this.sideLength, 20)
            pop();
        }
    }

    update() {
        for (const part of this.parts) {
            Body.rotate(part, this.angle + this.angleV, createVector(this.pos.x, this.pos.y))
        }
    }

    updateSideLength(newSideLength) {
        this.sideLength = newSideLength;
        this.generateShape();
    }

    updateSize(newSize) {
        this.size = newSize;
        this.centerOffset = this.pos.x - this.sideLength / 2
        this.generateShape();
    }

    updateSides(newSides) {
        this.sides = newSides;
        if (this.sides == 3) {
            this.sideLength *= 2
        }
        this.generateShape();
    }

    generateShape() {
        Composite.remove(this.simulation.world, this.parts)
        this.parts = [];
        var angleDiv = 360 / this.sides
        for (let i = 0; i < this.sides; i++) {
            let newAngle = i * angleDiv
            this.parts.push(
                Bodies.rectangle(
                    this.centerOffset * this.size, this.pos.y,
                    this.width, this.sideLength * this.size,
                    {
                        isStatic: true,
                        friction: 0,
                        restitution: 1,
                    }

                )
            )
            Body.rotate(this.parts[i], radians(newAngle), createVector(this.pos.x, this.pos.y))

        }
        Composite.add(this.simulation.world, this.parts);
    }


}