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

        this.gui.addHTML(
            "Instructions",
            "<center>Instructions</center>"
        )

        this.gui.addBoolean(
            "Gravity",
            true,
            this.toggleGravity.bind(this)
        )

        /* Object-Specific Settings */
        this.gui.addDropDown(
            "Object Type", 
            ["Circle", "Platform", "Emitter"], 
            this.changeObjectType.bind(this)
        )

        /* Circle */
        this.gui.addHTML(
            "Circle Settings",
            "<center><b>Circle Settings</b></center>"
        ).hideTitle("Circle Settings")

        this.gui.addRange(
            "Circle Size",
            5, 25, 1, this.changeCircleSize.bind(this)
        )

        /* Platform */
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

        /* Emitter */
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
        } else {
            this.gui.hideControl("Circle Settings")
            this.gui.hideControl("Circle Size")
        }

        /* PLATFORM */
        if (this.currentObjectDrawType == "Platform") {
            this.gui.showControl("Platform Settings")
            this.gui.showControl("Static")
            this.gui.showControl("Fixed Rotation")
        } else {
            this.gui.hideControl("Platform Settings")
            this.gui.hideControl("Static")
            this.gui.hideControl("Fixed Rotation")
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
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10, 
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

    toggleGravity() {
        if(this.getValue("Gravity")) {
            this.simulation.world.gravity.y = 1
        } else {
            this.simulation.world.gravity.y = 0
        }
    }

    /* UNUSED CALLBACKS */
    changeStaticPlatform() {}

    changeCircleSize() {}

    changeEmitterSize() {}

    changeEmitterDelay() {}

    changeRoot() {}

    changeMode() {}

    changeMIDIInput() {}

    changeMIDIOutput() {}

    changeRotationSpeed() {}

    /* UTILITIES */
    getValue(title) {
        return this.gui.getValue(title)
    }

    mouseHovering() {
        return this.gui.mouseHovering("gui") || this.settings.mouseHovering("settings");
    }
}