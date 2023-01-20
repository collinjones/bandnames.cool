class Container {
    constructor (simulation, size, width, sides, pos) {
        this.simulation = simulation
        this.size = size
        this.width = width
        this.pos = pos;
        this.sides = sides;
        this.parts = [];
        this.angle = 0
        this.angleV = 0.01
        this.setup();
    }

    setup() {
        var x = this.pos.x
        var xoff = this.pos.x - this.size / 2
        var y = this.pos.y

        if (this.sides >= 3) {

            var angleDiv = 360 / this.sides

            for (let i = 0; i < this.sides; i++) {

                let newAngle = i * angleDiv
                
                this.parts.push(
                    Bodies.rectangle(
                        xoff, y, 
                        this.width, this.size, 
                        {
                            density: 100,
                            stiffness: 0.5,
                            isStatic: true,
                            friction: 0,
                            restitution: 1
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
            rect(0, 0, this.width, this.size)
            pop();
        }
    }

    update () {
        for (const part of this.parts) {
            Body.rotate(part, this.angle + this.angleV, createVector(this.pos.x, this.pos.y))
        }
    }


}