class Simulation {

    constructor(canvas) {
        this.canvas = canvas;
        this.engine = null;
        this.world = null;
        this.mouse = null;

        this.circles = [];
        this.platforms = [];
        this.emitters = [];
        this.containers = [];

        this.screen_boundary;
        this.boundary = {
            "x": 0, 
            "y": 0, 
            "width": windowWidth, 
            "height": windowHeight
        }

        this.screen_div = 50;
        this.width_div = width / this.screen_div
        this.height_div = height / this.screen_div
        this.interactable = true;

        this.mouseReleased = true;

        this.setup();
    }



    setup() {
        WebMidi.enable().then(this.midiEnabled.bind(this)).catch(err => alert(err));

        this.engine = Engine.create({
            friction: 0.05,
        });

        this.world = this.engine.world;
        this.mouse = new Mouse(this);

        /* Add collision listener with collisionEvent as callback */
        Events.on(this.engine, 'collisionStart', this.collisionEvent.bind(this))
        Events.on(this.engine, 'afterUpdate', this.removeObjectFromWorld.bind(this));

        this.engine.timing.timeScale = 0.25
        Runner.run(this.engine);
    }

    /* If an object has left the screen, remove it from the world composite */
    removeObjectFromWorld() {
        for (var i = 0; i < this.world.bodies.length; i++) {
            var body = this.world.bodies[i];
            if (body.position.x < this.boundary.x 
             || body.position.x > this.boundary.x + this.boundary.width
             || body.position.y < this.boundary.y 
             || body.position.y > this.boundary.y + this.boundary.height
                ) {
                Composite.remove(this.world, body);
            }
        }
    }

    // Update game logic then draw to screen
    run() {
        this.update();
        this.draw();
    }

    // Updates various components
    update() {
        this.updateEmitters();
        this.updatePlatforms();
        this.updateContainers();

        /* Disable sketch interaction if mouse is hovering UI */
        if (this.gui && this.gui.mouseHovering()) {
            this.interactable = false;
        }

    }

    // Draws things to the screen
    draw() {
        background(
            this.gui ? 
            this.gui.settings.getValue("Background Color") :
            "black");

        this.drawEmitters();
        this.drawPlatforms();
        this.drawCircles();
        this.drawContainers();
        this.drawCurrentObjectPreview();
        this.mouse.draw();
    }

    drawContainers() {
        for (const container of this.containers) {
            container.draw();
        }
    }

    drawCircles() {
        for (const [i, circle] of this.circles.entries()) {
            circle.draw();

            /* Remove circle if out of bounds */
            if (circle.checkIfOutsideBounds()) {
                this.circles.splice(i, 1)
            }

            /* Break loop if all circles are destroyed */
            if (this.circles.length == 0) {
                break;
            }
        }
    }

    drawPlatforms() {
        for (const platform of this.platforms) {
            platform.draw();
        }
    }

    drawEmitters() {
        for (const emitter of this.emitters) {
            emitter.draw();
        }
    }

    drawContainerPreview() {
        if (this.gui.getValue("Container Editor").value == "New Container") {
            var numberOfSides = this.gui.getValue("Sides")
            var containerWidth = this.gui.getValue("Side Thickness") * 2;
            var containerSize = this.gui.getValue("Container Size")
            var lengthMultiplier = this.gui.getValue("Side Length")
            var pos = createVector(mouseX, mouseY)
            var angleDiv = 360 / numberOfSides
            var centerOffset = pos.x - containerSize * 25
            var sideLength = pos.x - centerOffset

            translate(mouseX, mouseY)
            for (let i = 0; i < numberOfSides; i++) {
                push();
                noStroke();
                fill(255, 255, 255, 25)
                rotate(radians(i * angleDiv))
                rect(sideLength, 0, containerWidth / 2, 
                (sideLength * 2) * lengthMultiplier, 20)
                pop();
            }
        }
    }

    drawCurrentObjectPreview() {
        if (this.gui && this.gui.currentObjectDrawType == "Container") {
            this.drawContainerPreview();
        }
    }

    updateEmitters() {
        for (const emitter of this.emitters) {
            emitter.emit();
        }
    }

    updatePlatforms() {
        for (const platform of this.platforms) {
            platform.update();
        }
    }

    updateContainers() {
        for (const container of this.containers) {
            container.update();
        }
    }

    /* Generate rotating platforms */
    generateRotatingPlatforms() {
        for (let y = 0; y < this.height_div; y++) {
            this.platforms[y] = [];
            for (let x = 0; x < this.width_div; x++) {
                this.platforms[y].push(new Platform(this,           // sim
                    (x * this.screen_div) + this.screen_div / 2,     // x pos
                    (y * this.screen_div) + this.screen_div / 2,     // y pos
                    this.screen_div,                                 // width
                    this.screen_div / 10,                              // height
                    random(5),                                       // angle
                    random(0.05) + 0.01,                             // angle velocity
                    color(255, 204, 0))),
                    true,
                    this.gui.getValue("Platform Friction"),
                    this.gui.getValue("Platform Bounciness")

            }
        }
    }

    /* Function triggered on a collision event */
    collisionEvent(event) {

        var pairs = event.pairs;

        /* For each pair */
        for (let i = 0; i < pairs.length; i++) {
            var bodyA = pairs[i].bodyA;
            var bodyB = pairs[i].bodyB;

            if (bodyA.label == "Circle Body" && bodyB.label == "Rectangle Body" ||
                bodyB.label == "Circle Body" && bodyA.label == "Rectangle Body") {
                /* Find the circle body and handle its collision event */
                if (bodyA.label == "Circle Body") {
                    this.circleCollisionEvent(bodyA);
                } else if (bodyB.label == "Circle Body") {
                    this.circleCollisionEvent(bodyB);
                }
            }
        }
    }

    /* Function triggered on a circle collision event */
    circleCollisionEvent(body) {

        /* Find the circle in the array of circles */
        for (let i = 0; i < this.circles.length; i++) {
            if (this.circles[i].body.id == body.id) {
                this.circles[i].collisionEvent();
                break;
            }
        }
    }

    /* Generate a new circle */
    createCircle(pos, note) {
        this.circles.push(new Circle(
            this,
            pos.x, pos.y,
            this.gui.getValue("Circle Size"),
            note)
        )
    }

    createEmitter() {
        this.emitters.push(new Emitter(this,
            createVector(mouseX, mouseY),
            this.gui.getValue("Emitter Size"),
            this.gui.getValue("Emitter Delay"))
        );
    }

    createPlatform(pos, angle, size, isStatic) {
        this.platforms.push(new Platform(
            this, pos.x, pos.y,
            size, 10,
            angle,
            this.gui.getValue("Fixed Rotation") ? this.gui.getValue("Rotation Speed") / 100 : 0,
            color(255, 204, 0),
            isStatic));
    }

    removeContainer(containerID) {
        for (let i = 0; i < this.containers.length; i++) {
            if (this.containers[i].id == containerID - 1) {
                this.containers[i].removeFromWorld();
                this.containers.splice(i, 1);
                this.gui.updateContainersList();
                break;
            }
        }
    }

    createContainer(pos) {
        let containerSize = this.gui.getValue("Container Size")
        let containerWidth = 10;
        let numberOfSides = this.gui.getValue("Sides")
        let rotationSpeed = this.gui.getValue("Container Speed")

        let newContainer = new Container(
            this, 
            containerSize, 
            containerWidth, 
            numberOfSides, 
            this.gui.getValue("Side Length"), 
            pos, 
            this.containers.length,
            rotationSpeed
        )

        this.containers.push(newContainer)

        /* Add container to Containers list in GUI */
        this.gui.updateContainersList()
    }

    isInteractable() {
        return this.interactable;
    }

    disableInteraction() {
        this.interactable = false;
    }

    enableInteraction() {
        this.interactable = true;
    }

    // Called once MIDI is enabled
    midiEnabled() {
        this.MIDIOut_controller = new MIDIOutput();  // midi output controller
        this.MIDIIn_controller = new MIDIInput(this);  // midi output controller  

        WebMidi.inputs.forEach(input =>
            this.MIDIIn_controller.MIDIInList.push(input.name)
        );
        WebMidi.outputs.forEach(output =>
            this.MIDIOut_controller.MIDIOutList.push(output.name)
        );

        if (this.MIDIIn_controller.MIDIInList.length == 0) {
            this.MIDIIn_controller.MIDIInList.push("No MIDI Devices Found")
        }

        if (this.MIDIOut_controller.MIDIOutList.length == 0) {
            this.MIDIOut_controller.MIDIOutList.push("No MIDI Devices Found")
        }

        this.MIDIFactory = new MIDIFactory();
        this.MIDIFactory.deriveMode();

        this.gui = new GUIController(this, "Motion Sound Sequencer")
    }

}