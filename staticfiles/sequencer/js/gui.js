class GUI {
    constructor (simulation, name) {
        this.simulation = simulation;
        this.gui = QuickSettings.create(10, 10, name)
        this.currentObjectDrawType = "Circle";

        /* SEQUENCER CONTROLS */
        this.gui.addButton(
            "General Settings",
            this.generalSettings.bind(this)
        ).overrideStyle("General Settings", "width", "100%")

        this.gui.addButton(
            "Instructions",
            this.instructions.bind(this)
        ).overrideStyle("Instructions", "width", "100%")

        this.gui.addBoolean(
            "Gravity",
            true,
            this.toggleGravity.bind(this)
        )

        /* OBJECT DRAW TYPES */
        this.gui.addDropDown(
            "Object Type", 
            ["Circle", "Platform", "Emitter"], 
            this.changeObjectType.bind(this)
        )

        /* CIRCLE SETTINGS */
        this.gui.addHTML(
            "Circle Settings",
            "<center><b>Circle Settings</b></center>"
        ).hideTitle("Circle Settings")

        this.gui.addRange(
            "Circle Size",
            5, 25, 1, this.changeCircleSize.bind(this)
        )

        this.gui.addRange(
            "Circle Friction",
            0, 10, 1, this.changeCircleFriction.bind(this)
        ).setValue("Circle Friction", 3)

        this.gui.addRange(
            "Circle Bounciness",
            0, 10, 1, this.changeCircleBounciness.bind(this)
        ).setValue("Circle Bounciness", 8)

        /* PLATFORM SETTINGS */
        this.gui.addHTML(
            "Platform Settings",
            "<center><b>Platform Settings</b></center>"
        ).hideTitle("Platform Settings").hideControl("Platform Settings")

        this.gui.addBoolean(
            "Static",
            false,
            this.changeStaticPlatform.bind(this)
        ).hideControl("Static")

        this.gui.addBoolean(
            "Fixed Rotation",
            false,
            this.changeFixedRotation.bind(this)
        ).hideControl("Fixed Rotation")

        this.gui.addRange(
            "Rotation Speed",
            1, 20, 1,
            this.changeRotationSpeed.bind(this)
        ).hideControl("Rotation Speed")

        /* EMITTER SETTINGS */
        this.gui.addHTML(
            "Emitter Settings",
            "<center><b>Emitter Settings</b></center>"
        ).hideTitle("Emitter Settings").hideControl("Emitter Settings")

        this.gui.addRange(
            "Emitter Size",
            5, 25, 1, this.changeEmitterSize.bind(this)
        ).hideControl("Emitter Size")

        this.gui.addRange(
            "Emitter Delay",
            1, 20, 1,
            this.changeEmitterDelay.bind(this)
        ).hideControl("Emitter Delay")

        this.gui.addDropDown(
            "Mode",
            Object.keys(this.simulation.MIDIFactory.modes),
            this.changeMode.bind(this)
        ).hideControl("Mode")

        this.gui.addDropDown(
            "Root",
            Object.keys(this.simulation.MIDIFactory.noteNames),
            this.changeRoot.bind(this)
        ).hideControl("Root")

        var e = document.getElementsByClassName("qs_main")[0];
        e.id = "gui"

        this.settings = QuickSettings.create(
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10, 
            10, "General Settings").hide();

        /* GENERAL SETTINGS */

        this.settings.addColor(
            "Background Color",
            "#7a7d7f",
            this.backgroundColor.bind(this)
        )

        this.settings.addButton(
            "Fullscreen",
            this.fullscreen.bind(this)
        ).overrideStyle("Fullscreen", "width", "100%")

        this.settings.addButton(
            "Clear Scene",
            this.clearScene.bind(this)
        )
        this.settings.overrideStyle("Clear Scene", "width", "100%")

        this.settings.addDropDown(
            "MIDI Input Device",
            this.simulation.MIDIIn_controller.MIDIInList,
            this.changeMIDIInput.bind(this)
        )

        this.settings.addDropDown(
            "MIDI Output Device",
            this.simulation.MIDIOut_controller.MIDIOutList,
            this.changeMIDIOutput.bind(this)
        )

        var e = document.getElementsByClassName("qs_main")[1];
        e.id = "settings"

        /* INSTRUCTIONS */
        this.info = QuickSettings.create(
            this.settings._hidden ? 
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10 : 
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + this.settings.getPanelPosition().x + this.settings.getPanelDimensions().width + 10, 10, "Instructions"
        ).hide();

        this.info.addHTML(
            "Instructions",
            "<center><b>Instructions</b></center>\
                <p> Choose an Object Type.</p>\
                <h3>Circles</h3>\
                <p> Select a MIDI Input device and play some notes to spawn in circles, \
                        or click with your mouse to generate random notes. <br><br> \
                        Circles also have friction and bouncieness. </p>\
                <h3>Platforms</h3>\
                <p> Platforms cause a Circle to trigger its note. Create Platforms by clicking and dragging to choose a size. <br><br>\
                        Choose <b>Static</b> to prevent the Platform from being pushed around, and <b>Fixed Rotation</b> to choose a fixed rotation speed. </p>\
                <h3>Emitters</h3>\
                <p> Emitters generate Circles. <b>Mode</b> and <b>Root</b> can be chosen for Emitters, as well as the <b>Size</b> and the <b>Delay</b> between emission. \
                        Create Emitters by clicking with your mouse. </p>\
            "
        ).hideTitle("Instructions")

        var e = document.getElementsByClassName("qs_main")[2];
        e.id = "instructions"

    }

    /* ACTIVE CALLBACKS */

    fullscreen() {
        var fs = fullscreen()
        fullscreen(!fs)
        this.gui.setPosition(10, 10)
        resizeCanvas(windowWidth, windowHeight);
    }

    clearScene() {
        this.simulation.circles = [];
        this.simulation.emitters = [];
        this.simulation.platforms = [];
        Composite.clear(this.simulation.engine.world)
        Engine.clear(this.simulation.engine)
    }

    changeObjectType() {
        this.currentObjectDrawType = this.gui.getValue('Object Type').value

        /* CIRCLE */
        if (this.currentObjectDrawType == "Circle") {
            this.gui.showControl("Circle Settings")
            this.gui.showControl("Circle Size")
            this.gui.showControl("Circle Friction");
            this.gui.showControl("Circle Bounciness")
        } else {
            this.gui.hideControl("Circle Settings")
            this.gui.hideControl("Circle Size")
            this.gui.hideControl("Circle Friction");
            this.gui.hideControl("Circle Bounciness")
        }

        /* PLATFORM */
        if (this.currentObjectDrawType == "Platform") {
            if (this.getValue("Fixed Rotation")) {
                this.gui.showControl("Rotation Speed")
            }
            this.gui.showControl("Platform Settings")
            this.gui.showControl("Static")
            this.gui.showControl("Fixed Rotation")
        } else {
            this.gui.hideControl("Platform Settings")
            this.gui.hideControl("Static")
            this.gui.hideControl("Fixed Rotation")
            this.gui.hideControl("Rotation Speed")
        }

        /* EMITTER */
        if (this.currentObjectDrawType == "Emitter") {
            this.gui.showControl("Emitter Settings")
            this.gui.showControl("Emitter Size")
            this.gui.showControl("Mode")
            this.gui.showControl("Root")
            this.gui.showControl("Emitter Delay")
        } else {
            this.gui.hideControl("Emitter Settings")
            this.gui.hideControl("Mode")
            this.gui.hideControl("Root")
            this.gui.hideControl("Emitter Delay")
            this.gui.hideControl("Emitter Size")
        }
    }

    changeFixedRotation() {
        if (this.getValue("Fixed Rotation")) {
            this.gui.showControl("Rotation Speed")
        } else {
            this.gui.hideControl("Rotation Speed")
        }
    }

    generalSettings() {

        /* When General Settings is selected, set position of new window to the right of sequencer controls */
        this.settings.setPosition(
            this.info._hidden ? 
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10 : 
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width * 2 + 20, 
            this.gui.getPanelPosition().y
        )

        /* If the window ends up outside of the screen bounds, set the new window to the left instead */
        if (this.settings.getPanelPosition().x + this.settings.getPanelDimensions().width > width) {
            this.settings.setPosition(
                this.gui.getPanelPosition().x - this.gui.getPanelDimensions().width - 10, 
                this.gui.getPanelPosition().y
            )
        }

        this.settings.toggleVisibility();
    }

    instructions() {
        if (this.settings._hidden) {
            this.info.setPosition(
                this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10, 
                this.gui.getPanelPosition().y
            )
        } else {
            this.info.setPosition(
                this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width * 2 + 20, 
                this.gui.getPanelPosition().y
            )
        }
        this.info.setPosition(
            this.settings._hidden ? 
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10 : 
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width * 2 + 20, 
            this.gui.getPanelPosition().y
        )
        
        this.info.toggleVisibility();
    }

    toggleGravity() {
        if(this.getValue("Gravity")) {
            this.simulation.world.gravity.y = 1
        } else {
            this.simulation.world.gravity.y = 0
        }
    }

    /* UNUSED CALLBACKS */
    changeStaticPlatform() {}
    changeRotationSpeed() {}

    changeCircleSize() {}
    changeCircleFriction() {}
    changeCircleBounciness() {}

    changeEmitterSize() {}
    changeEmitterDelay() {}

    changeRoot() {}
    changeMode() {}

    changeMIDIInput() {}
    changeMIDIOutput() {}

    backgroundColor() {}

    /* UTILITIES */
    getValue(title) {
        return this.gui.getValue(title)
    }

    mouseHovering() {
        return this.gui.mouseHovering("gui") || this.settings.mouseHovering("settings") || this.info.mouseHovering("instructions")
    }
}