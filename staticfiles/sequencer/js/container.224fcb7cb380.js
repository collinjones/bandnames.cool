class Container {
    constructor (simulation, size, width, sideLength, sides, pos) {
        this.simulation = simulation
        /* Triangle */
        // if (sides == 3) {
        //     this.size = size * 1.768
        // } else if (sides == 4) {
        //     this.size = size + 10;
        // } else if (sides == 5) {
        //     this.size = size - 45
        // }
        this.size = size;
        this.sideLength = sideLength
        this.width = width
        this.pos = pos;
        this.sides = sides;
        this.parts = [];
        this.angle = 0
        this.angleV = 0.0
        this.xoff = this.pos.x - size / 2
        this.setup();
    }

    setup() {
        var x = this.pos.x
        var y = this.pos.y

        if (this.sides >= 3) {

            var angleDiv = 360 / this.sides

            for (let i = 0; i < this.sides; i++) {
                let newAngle = i * angleDiv
                this.parts.push(
                    Bodies.rectangle(
                        this.xoff, y, 
                        this.width, this.sideLength, 
                        {
                            density: 100,
                            stiffness: 0.5,
                            isStatic: true,
                            friction: 0,
                            restitution: 1,
                            chamfer: { radius: 20 }
                        }

                    )
                )
                Body.rotate(this.parts[i], radians(newAngle), createVector(x, y))
    
            }
            Composite.add(this.simulation.world, this.parts);
        }
    }

    draw () {
        for (const part of this.parts) {
            var pos = part.position;
            var angle = part.angle;
            
            push();
            fill("white")
            noStroke()
            translate(pos.x, pos.y)
            rotate(angle)
            rect(0, 0, this.width, this.sideLength, 20)
            pop();
        }
    }

    update () {
        for (const part of this.parts) {
            Body.rotate(part, this.angle + this.angleV, createVector(this.pos.x, this.pos.y))
        }
    }

    updateSideLength(newSideLength) {
        this.sideLength = newSideLength
        console.log(this.sideLength)
    }


}