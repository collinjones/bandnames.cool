class ScreenBoundary {
    constructor(simulation, thickness, color) {
        this.simulation = simulation;
        this.rects = []

        // Top Edge
        this.rects.push(new Platform(
            this.simulation, 
            width/2, 
            0, 
            width, 
            thickness, 
            0, 
            0, 
            color,
            true
        ));

        // Right Edge
        this.rects.push(new Platform(
            this.simulation, width, height/2, thickness, height, 0, 0, color, true
        ));

        // Bottom Edge
        this.rects.push(new Platform(
            this.simulation, width/2, height, width, thickness, 0, 0, color, true
        ));

        // Left Edge
        this.rects.push(new Platform(
            this.simulation, 0, height/2, thickness, height, 0, 0, color, true
        ));
    }

    draw() {
        for (let i = 0; i < this.rects.length; i++) {
            this.rects[i].draw();
        }
    }
}