function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('sketch-holder');
    background(200)

    var bandnames = "{{bandnames}}"
    var bn_arr = bandnames.split(',')
    for (var i = 0; i < bn_arr.length; i++) {
        bn_arr[i] = bn_arr[i].slice(12)
        bn_arr[i] = bn_arr[i].slice(0, -1)

        if (i == bn_arr.length - 1) {
            bn_arr[i] = bn_arr[i].slice(0, -1)
        }
    }

    for (var i = 0; i < bn_arr.length; i++) {
        text(bn_arr[i], 30, 30 + (i * 10))
    }
    // Set colors
    fill(204, 101, 192, 127);
    stroke(127, 63, 120);
    
    // A rectangle
    rect(40, 120, 120, 40);
    // An ellipse
    ellipse(240, 240, 80, 80);
    // A triangle
    triangle(300, 100, 320, 100, 310, 80);
    
    // A design for a simple flower
    translate(580, 200);
    noStroke();
    for (let i = 0; i < 10; i ++) {
        ellipse(0, 30, 20, 80);
        rotate(PI/5);
    }
}