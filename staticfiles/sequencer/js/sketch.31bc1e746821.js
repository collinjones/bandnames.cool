p5.disableFriendlyErrors = true; // disables FES

var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body
    Composite = Matter.Composite,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint

var sequencer;
var startMouseVector;
var start_vector_set = false;
var distance = 0;
var angle = 0;
var drawing_rect = false;
var paused = false;
var mouseWasClicked = false
var draggingContainer = false;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    rectMode(CENTER)
    sequencer = new Sequencer(canvas);
}

function draw() {
    if (!paused) {
        sequencer.run();

        if (drawing_rect) {
            drawRect();
        }
    }

    // Prevent the sequencer from running if the window is not focused
    if (!focused) {
        paused = true;
    } else {
        paused = false;
    }
}

// REFACTOR probably encapsulated inside Boundary somehow
// Draws platforms in real-time as user drags to resize 
function drawRect() {
    push();
    translate(startMouseVector.x, startMouseVector.y)
    stroke(color(255, 204, 0, 100))
    if (sequencer.gui.getValue("Static")) {
        fill(255, 204, 0);
    } else {
        noFill();
        ellipse(0, 0, 5, 5)
    }

    rotate(angle)
    rect(0, 0, distance * 2, 10);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    this.sequencer.updateBoundary()
}

// Checks if the mouse is in bounds
function mouseInBounds() {
    return mouseX >= 1 && mouseX <= width && mouseY <= height && mouseY >= 1 ? true : false;
}

// Handles mouse pressed logic
function mousePressed() {
    
    sequencer.mouseReleased = false;
    if (sequencer.isInteractable()) {
        mouseWasClicked = true;
        if (mouseButton === LEFT) {
            if (sequencer.gui.currentObjectDrawType == "Circle" && mouseInBounds()) {
                sequencer.createCircle(createVector(mouseX, mouseY), sequencer.midiFactory.generateRandomNoteName());
            } else if (sequencer.gui.currentObjectDrawType == "Emitter" && mouseInBounds()) {
                sequencer.createEmitter();
            } else if (sequencer.gui.currentObjectDrawType == "Container" && mouseInBounds()) {
                if (sequencer.gui.getValue("Container Editor").value == "New Container") {
                    sequencer.createContainer(createVector(mouseX, mouseY));
                }
            }
        }
    }
}

// Handles mouse dragged logic 
function mouseDragged() {
    if (sequencer.isInteractable()) {
        if (sequencer.gui.currentObjectDrawType == "Container" && mouseInBounds()) {
            draggingContainer = true;
            if (sequencer.gui.getValue("Container Editor").value != "New Container") {
                var selectionID = Number(sequencer.gui.getValue("Container Editor").value) - 1;
                
                /* Find which container is selected based on the ID and call the selected logic */
                for (const container of this.sequencer.containers) {
                    if (container.id == selectionID) {
                        var mousePos = createVector(mouseX, mouseY);
                        container.updatePosition(mousePos);
                    }
                }
            }
        } else if (sequencer.gui.currentObjectDrawType == "Platform" && mouseInBounds()
            && mouseButton === LEFT && !draggingContainer) {
            if (!start_vector_set) {
                startMouseVector = createVector(mouseX, mouseY)
                start_vector_set = true;
            } else {
                let currentMouseVector = createVector(mouseX, mouseY)
                let angleV = createVector(mouseX - startMouseVector.x, mouseY - startMouseVector.y);
                distance = floor(startMouseVector.dist(currentMouseVector));
                angle = angleV.heading();
                drawing_rect = true;
            }
        } 
    }
}

// Handles mouse released logic
function mouseReleased() {
    sequencer.mouseReleased = true;
    if (sequencer.isInteractable()) {
        if (start_vector_set) {
            sequencer.createPlatform(
                startMouseVector, angle, distance * 2, sequencer.gui.getValue("Static")
            );
            start_vector_set = false;
            drawing_rect = false;
        }
        draggingContainer = false;
    }
}