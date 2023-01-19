class Platform {
    constructor(simulation, x, y, w, h, a, aV, color, isStatic, friction, restitution) {
        this.simulation = simulation;
        this.isStatic = isStatic;
        this.color = color;
        this.options = {
            angle: a,
            isStatic: isStatic,
            friction: friction,
            restitution: restitution
        }
        this.angle = 0;
        this.angleV = aV;
        this.body = Bodies.rectangle(x, y, w, h, this.options);
        this.constraint = Constraint.create({
            pointA: createVector(x, y),
            bodyB: this.body,
            stiffness: 1,
            length: 0
        })
        this.w = w;
        this.h = h;
        Composite.add(this.simulation.world, [this.body, this.constraint]);
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