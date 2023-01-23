class Container {
    constructor(simulation, size, width, sideLength, sides, pos) {

        this.simulation = simulation

        this.size = size;
        this.sideLength = sideLength
        this.width = width
        this.pos = pos;
        this.sides = sides;

        this.parts = [];
        this.angle = 0
        this.angleV = 0.0
        this.centerOffset = this.pos.x - size / 2
        this.scaleFactor = 0;

        this.perimeter = sides * this.sideLength

        this.setup();
    }

    setup() {
        this.generateShape();
    }

    draw() {
        for (let i = 0; i < this.sides; i++) {
            var part = this.parts[i]
            var partPos = part.position
            console.log('drawin')
            push();
            fill("white")
            noStroke()
            translate(partPos.x, partPos.y)
            rotate(partPos.angle)
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
        this.centerOffset = this.pos.x - this.size / 2
        this.generateShape();
    }

    updateSides(newSides) {
        this.sides = newSides;
        this.generateShape();
    }

    generateShape() {
        Composite.remove(this.simulation.world, this.parts)
        this.parts = [];
        var angleDiv = 360 / this.sides
        for (let i = 0; i < this.sides; i++) {
            var x = this.size * this.sideLength * Math.cos((this.angleDiv * i - 90) * (Math.PI / 180))
            var y = this.size * this.sideLength * Math.sin((this.angleDiv * i - 90) * (Math.PI / 180))
            this.parts.push(
                Bodies.rectangle(
                    x, y,
                    this.width, this.sideLength,
                    {
                        isStatic: true,
                        friction: 0,
                        restitution: 1,
                    }

                )
            )
            // Body.rotate(this.parts[i], radians(newAngle), createVector(this.pos.x, this.pos.y))

        }
        Composite.add(this.simulation.world, this.parts);
    }


}