class Platform {
    constructor(simulation, x, y, w, h, a, aV, color, isStatic) {
        this.simulation = simulation;
        this.isStatic = isStatic;
        this.color = color;
        this.options = {
            angle: a,
            isStatic: isStatic,
            friction: 0,
            restitution: 0.99,
        }
        this.angle = 0;
        this.angleV = aV;
        this.body = Bodies.rectangle(x, y, w, h, this.options);
        this.w = w;
        this.h = h;

        /* Adjust restitution (not sure why, but when isStatic is true, restitution is set to 0) */
        this.body.restitution = 0.99

        if (!isStatic) {
            this.constraint = Constraint.create({
                pointA: createVector(x, y),
                bodyB: this.body,
                stiffness: 1,
                length: 0
            });
            Composite.add(this.simulation.world, [this.body, this.constraint]);
        } else {
            Composite.add(this.simulation.world, this.body);
        }
    }

    draw() {
        var pos = this.body.position;
        var angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y)
        
        smooth();
        stroke(this.color)
        if(this.isStatic) {
            fill(this.color)
        } else {
            noFill();
            ellipse(0, 0, 5, 5)
        }
        
        rotate(angle)
        rect(0, 0, this.w, this.h)
        pop();
    }

    update() {
        Matter.Body.rotate(this.body, this.angle + this.angleV)
    }
}