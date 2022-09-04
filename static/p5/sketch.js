let angle = 0;

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('sketch-holder');
    rectMode(CENTER);
    angleMode(DEGREES);
    noStroke();
}

function draw() {
    background(220);

    // Red square at (100, 100)
    push();
    translate(100, 100);
    rotate(angle);
    fill('red');
    rect(0, 0, 50, 50);
    pop();  //The origin is back to (0, 0) and rotation is back to 0.

    // Green square at (300, 300)
    push();
    translate(300, 300);
    rotate(-1 * angle);
    fill('green');
    rect(0, 0, 50, 50);
    pop();

    angle += 1;
}


