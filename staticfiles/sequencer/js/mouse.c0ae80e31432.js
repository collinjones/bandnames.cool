/**
Creates a representation of the user's mouse for being able to interact with the Matter.js world.
@param {simulation} simulation - simulation class
@param {object} attributes - (Optional) Attributes like color
@example
let mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 })
@tutorial
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>
*/

class Mouse {
    constructor(simulation, attributes) {
        this.simulation = simulation;
        this.attributes = attributes || { stroke: "magenta", strokeWeight: 2 };
        this.mouse = Matter.Mouse.create(simulation.canvas.elt);
        const mouseOptions = {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.25,
                angularStiffness: 0
            }
        }
        this.mouseConstraint = MouseConstraint.create(simulation.engine, mouseOptions);
        this.mouseConstraint.mouse.pixelRatio = window.devicePixelRatio;

        Composite.add(simulation.world, this.mouseConstraint);

        // Add event with 'mousemove'
        Events.on(this.mouseConstraint, 'mousemove', function (event) {
            // For Matter.Query.point pass "array of bodies" and "mouse position"
            var foundPhysics = Matter.Query.point(Composite.allBodies(simulation.world), event.mouse.position);

            /* Circle hover */
            if (foundPhysics[0] && foundPhysics[0].label == "Circle Body") {
                for (let i = 0; i < simulation.circles.length; i++) {
                    if (simulation.circles[i].body.id == foundPhysics[0].id) {
                        var target = simulation.circles[i];
                        //target.hover();
                    }
                }

                /* Find hovering bodies again */
                foundPhysics = Matter.Query.point(Composite.allBodies(simulation.world), event.mouse.position);
                if (!foundPhysics[0] && target) {
                    console.log('')
                } 
            }
        });
    }

    /**
     * Subscribes a callback function to the given object's eventName
     * @param {string} eventName
     * @param {function} action
     * @memberof Mouse
     */
    on(eventName, action) {
        Events.on(this.mouseConstraint, eventName, action);
    }

    /**
     * Sets the mouse position offset e.g. { x: 0, y: 0 }
     * @param {object} offset
     * @memberof Mouse
     */
    setOffset(offset) {
        Matter.Mouse.setOffset(this.mouse, offset)
    }

    /**
     * Draws the mouse constraints to the p5 canvas
     * @memberof Mouse
     */
    draw() {
        push();
        stroke(this.attributes.stroke);
        strokeWeight(this.attributes.strokeWeight);
        this.drawMouse();
        pop();
    }

    drawMouse() {
        if (this.mouseConstraint.body) {
            const pos = this.mouseConstraint.body.position;
            const offset = this.mouseConstraint.constraint.pointB;
            const m = this.mouseConstraint.mouse.position;
            // line(pos.x + offset.x, pos.y + offset.y, m.x, m.y); // draws line from center of object to mouse
        }
    }
}