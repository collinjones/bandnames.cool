class Container {
    constructor (simulation, size, sides, pos) {
        this.simulation = simulation
        this.size = size;
        this.width = this.size / 5
        this.pos = pos;
        this.sides = sides;
        this.parts = [];
        this.angle = 0
        this.angleV = 0.005;
        this.setup();
    }

    setup() {
        var x = this.pos.x
        var xoff = this.pos.x - this.size / 2

        var y = this.pos.y
        var yoff = this.pos.y - this.size / 2

        if (this.sides >= 3) {

            var angleDiv = 360 / this.sides

            for (let i = 0; i < this.sides; i++) {

                let newAngle = i * angleDiv
                
                this.parts.push(
                    Bodies.rectangle(
                        this.pos.x - this.size / 2, y, 
                        this.width, this.size, 
                        {
                            density: 100,
                            stiffness: 0.5,
                            isStatic: true,
                            angle: radians(newAngle),
                            friction: 0,
                            restitution: 1
                        }

                    )
                )
            }

            // this.parts.push(
            //     Bodies.rectangle(
            //         this.pos.x - this.size / 2, y,
            //         this.width, this.size, 
            //         {
            //             density: 100,
            //             stiffness: 0.5,
            //             isStatic: true,
            //             friction: 0,
            //             restitution: 1
            //         }
            //     )
            // )
            // this.parts.push(
            //     Bodies.rectangle(
            //         x, yoff,
            //         this.width, this.size, 
            //         {
            //             density: 100,
            //             stiffness: 0.5,
            //             isStatic: true,
            //             angle: radians(90),
            //             friction: 0,
            //             restitution: 1
            //         }
            //     )
            // )
            // this.parts.push(
            //     Bodies.rectangle(
            //         x + this.size / 2, y,
            //         this.width, this.size, 
            //         {
            //             density: 100,
            //             stiffness: 0.5,
            //             isStatic: true,
            //             angle: radians(180),
            //             friction: 0,
            //             restitution: 1
            //         }
            //     )
            // )
            // this.parts.push(
            //     Bodies.rectangle(
            //         x, y + this.size / 2,
            //         this.width, this.size, 
            //         {
            //             density: 100,
            //             stiffness: 0.5,
            //             isStatic: true,
            //             angle: radians(270),
            //             friction: 0,
            //             restitution: 1
            //         }
            //     )
            // )
            Composite.add(this.simulation.world, this.parts);


            // for (const part of this.parts) {
            //     Body.setCentre(part, createVector(500, 500))
            // }
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