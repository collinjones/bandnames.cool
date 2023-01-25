class GUIController {
    constructor (simulation, name) {
        this.simulation = simulation;
        this.gui = null;
        this.info = null;
        this.settings = null;
        this.currentObjectDrawType = "Circle";
        this.gui = QuickSettings.create(10, 10, name)

        /* SEQUENCER CONTROLS */
        this.gui.addButton(
            "General Settings",
            this.generalSettings.bind(this)
        ).overrideStyle("General Settings", "width", "100%")

        this.gui.addButton(
            "Instructions",
            this.instructions.bind(this)
        ).overrideStyle("Instructions", "width", "100%")

        this.gui.addRange(
            "Gravity Amount",
            0, 1, 1, 0.1, this.changeGravityAmount.bind(this)
        )

        this.gui.addRange(
            "Time Scale",
            0, 1, .5, 0.01, 
            this.changeTimeScale.bind(this)
        )

        this.gui.addButton(
            "Clear Scene",
            this.clearScene.bind(this)
        )
        this.gui.overrideStyle("Clear Scene", "width", "100%")

        /* OBJECT DRAW TYPES */
        this.gui.addDropDown(
            "Object Type", 
            ["Circle", "Platform", "Emitter", "Container"], 
            this.changeObjectType.bind(this)
        )

        /* CIRCLE SETTINGS */
        this.gui.addHTML(
            "Circle Settings",
            "<center><b>Circle Settings</b></center>"
        ).hideTitle("Circle Settings")

        this.gui.addRange(
            "Circle Size",
            5, 25, 5, 1, this.changeCircleSize.bind(this)
        )

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
            1, 20, 1, 1,
            this.changeRotationSpeed.bind(this)
        ).hideControl("Rotation Speed")

        

        /* EMITTER SETTINGS */
        this.gui.addHTML(
            "Emitter Settings",
            "<center><b>Emitter Settings</b></center>"
        ).hideTitle("Emitter Settings").hideControl("Emitter Settings")

        this.gui.addRange(
            "Emitter Size",
            5, 25, 10, 1, this.changeEmitterSize.bind(this)
        ).hideControl("Emitter Size")

        this.gui.addRange(
            "Emitter Delay",
            1, 20, 1, 1,
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

        this.gui.addDropDown(
            "Octave",
            [1, 2, 3, 4, 5],
            this.changeOctave.bind(this)
        ).hideControl("Octave");

        this.gui.addRange(
            "Octave Range",
            1, 5, 1, 1, 
            this.changeOctaveRange.bind(this)
        ).hideControl("Octave Range")

        var e = document.getElementsByClassName("qs_main")[0];
        e.id = "gui"

        this.settings = QuickSettings.create(
            this.gui.getPanelPosition().x + this.gui.getPanelDimensions().width + 10, 
            10, "General Settings").hide();

        /* CONTAINER SETTINGS */
        this.gui.addHTML(
            "Container Settings",
            "<center><b>Container Settings</b></center>"
        ).hideTitle("Container Settings").hideControl("Container Settings")

        this.gui.addRange(
            "Sides",
            3, 50, 4, 1,
            this.changeContainerSides.bind(this)
        ).hideControl("Sides")

        this.gui.addRange(
            "Container Size", 
            1, 10, 1, 1,
            this.changeContainerSize.bind(this)
        ).hideControl("Container Size")

        this.gui.addRange(
            "Side Length",
            0.1, 1, 1, 0.01,
            this.changeSideLength.bind(this)
        ).hideControl("Side Length")

        this.gui.addRange(
            "Side Thickness",
            5, 50, 5, 1,
            this.changeSideThickness.bind(this)
        ).hideControl("Side Thickness")

        this.gui.addRange(
            "Container Speed",
            0, .25, 0.01, 0.01,
            this.changeContainerSpeed.bind(this)
        ).hideControl("Container Speed")
        
        this.gui.addDropDown(
            "Container Editor",
            ["New Container"],
            this.changeContainers.bind(this)
        ).hideControl("Container Editor")

        this.gui.addButton(
            "Remove Container",
            this.removeContainer.bind(this)
        ).overrideStyle("Remove Container", "width", "100%").hideControl(
            "Remove Container"
        )

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
                <p> Go to <b>General Settings</b> and choose your MIDI Input and Output device </p>\
                <p> MIDI Input Device will be the device used to spawn in notes. MIDI Output device will be the device the notes are sent to. </p>\
                <p> You can also choose the <b>Gravity</b> amount as well as the <b>Time Scale</b>, which will affect all non-static moving bodies, such as circles \
                and non-static platforms. </p>\
                <p> Choose an Object Type.</p>\
                <h3>Circles</h3>\
                <p> Select a MIDI Input device and play some notes to spawn in circles, \
                        or click with your mouse to generate random notes. </p> \
                <h3>Platforms</h3>\
                <p> Platforms cause a Circle to trigger its note. Create Platforms by clicking and dragging to choose a size. <br><br>\
                        Choose <b>Static</b> to prevent the Platform from being pushed around, and <b>Fixed Rotation</b> to choose a fixed rotation speed. </p>\
                <h3>Emitters</h3>\
                <p> Emitters generate Circles. <b>Mode</b> and <b>Root</b> can be chosen for Emitters, as well as the <b>Size</b> and the <b>Delay</b> between emission. \
                        Create Emitters by clicking with your mouse. </p>\
                        <p> The octave and range of octaves can be chosen as well. </p>\
                <h3> Containers </h3>\
                <p> Containers can also trigger MIDI notes. The number of sides the container has can be set, along with \
                    the size, the length of the sides, and the speed. </p>\
                    <p> Choose 'New Container' in the <b>Container Editor</b> to create a new container, or edit \
                    an existing container by selecting it from the dropdown. </p>\
            "
        ).hideTitle("Instructions")

        var e = document.getElementsByClassName("qs_main")[2];
        e.id = "instructions"
    }

    /* ACTIVE CALLBACKS */

    fullscreen() {
        var fs = fullscreen()
        fullscreen(!fs)

        this.gui.setPosition(10, 10);
        this.info.hide();
        this.settings.hide();

        resizeCanvas(windowWidth, windowHeight);
    }

    clearScene() {
        this.simulation.circles = [];
        this.simulation.emitters = [];
        this.simulation.platforms = [];
        this.simulation.containers = [];
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
            this.gui.showControl("Octave")
            this.gui.showControl("Octave Range")
        } else {
            this.gui.hideControl("Emitter Settings")
            this.gui.hideControl("Mode")
            this.gui.hideControl("Root")
            this.gui.hideControl("Emitter Delay")
            this.gui.hideControl("Emitter Size")
            this.gui.hideControl("Octave")
            this.gui.hideControl("Octave Range")
        }

        /* Container */
        if (this.currentObjectDrawType == "Container") {
            this.gui.showControl("Container Settings")
            this.gui.showControl("Container Editor")
            this.gui.showControl("Sides")
            this.gui.showControl("Container Size")
            this.gui.showControl("Side Length")
            this.gui.showControl("Side Thickness")
            this.gui.showControl("Container Speed")

        } else {
            this.gui.hideControl("Container Settings")
            this.gui.hideControl("Container Editor")
            this.gui.hideControl("Sides")
            this.gui.hideControl("Container Size")
            this.gui.hideControl("Side Length")
            this.gui.hideControl("Side Thickness")
            this.gui.hideControl("Container Speed")
        }
    }

    changeFixedRotation() {
        if (this.getValue("Fixed Rotation")) {
            this.gui.showControl("Rotation Speed")
        } else {
            this.gui.hideControl("Rotation Speed")
        }
    }

    removeContainer() {
        var containerID = this.getValue("Container Editor").value;
        this.simulation.removeContainer(containerID);
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

    changeOctave(data) {
        var max = 6;
        this.simulation.MIDIFactory.changeOctave(data.value)

        if (data.value + this.getValue("Octave Range") >= max) {
            /* Get the overflow ammount */
            let overflow = (data.value + this.getValue("Octave Range")) - max;
            
            /* Remove and re-add the control with updated octave range amounts */
            this.gui.removeControl("Octave Range");  
            this.gui.addRange(
                "Octave Range",
                1, overflow == 0 ? 1 : overflow, 1, 1,
                this.changeOctaveRange.bind(this)
            ).setValue("Octave Range", 1);

        /* Otherwise update octave range adjusted to new octave */
        } else {
            /* Remove and re-add the control with updated octave range amounts */
            this.gui.removeControl("Octave Range");
            this.gui.addRange(
                "Octave Range",
                1, max - data.value, 1, 1,
                this.changeOctaveRange.bind(this)
            ).setValue("Octave Range", 1);

        }
    }

    changeSideLength() {
        var selectionID = Number(this.getValue("Container Editor").value) - 1
        for (const container of this.simulation.containers) {
            if (container.id == selectionID) {
                container.updateSideLength(this.getValue("Side Length"))
            } 
            
        }
    }

    changeContainerSides() {
        var selectionID = Number(this.getValue("Container Editor").value) - 1
        for (const container of this.simulation.containers) {
            if (container.id == selectionID) {
                container.updateSides(this.getValue("Sides"))
            }
        }
    }
    changeContainerSize() {
        var selectionID = Number(this.getValue("Container Editor").value) - 1
        for (const container of this.simulation.containers) {
            if (container.id == selectionID) {
                container.updateSize(this.getValue("Container Size"))
            }
        }
    }

    changeContainerSpeed() {
        var selectionID = Number(this.getValue("Container Editor").value) - 1
        for (const container of this.simulation.containers) {
            if (container.id == selectionID) {
                container.updateContainerSpeed(this.getValue("Container Speed"))
            } 
        }
    }

    changeSideThickness() {
        var selectionID = Number(this.getValue("Container Editor").value) - 1
        for (const container of this.simulation.containers) {
            if (container.id == selectionID) {
                container.setSideThickness(this.getValue("Side Thickness"))
            } 
        }
    }

    changeGravityAmount() {
        this.simulation.world.gravity.y = this.getValue("Gravity Amount")
    }

    /* UNUSED CALLBACKS */

    /* Platform Callbacks */
    changeStaticPlatform() {}
    changeRotationSpeed() {}
    changePlatformBounciness() {}
    changePlatformFriction() {}

    /* Circle Callbacks */
    changeCircleSize() {}
    changeCircleFriction() {}
    changeCircleBounciness() {}

    /* Emitter Callbacks */
    changeEmitterSize() {}
    changeEmitterDelay() {}


    changeRoot(data) {
        this.simulation.MIDIFactory.changeRoot(data.value)
    }

    changeMode(data) {
        this.simulation.MIDIFactory.setMode(data.value)
    }
    
    changeOctaveRange(data) {
        this.simulation.MIDIFactory.setOctaveRange(data)
    }

    changeOctaveDirection() {}

    changeContainers(){
        var selectionID = Number(this.getValue("Container Editor").value) - 1;
        if (!isNaN(selectionID)) {
            this.gui.showControl("Remove Container")
        } else {
            this.gui.hideControl("Remove Container")
        }

        for (const container of this.simulation.containers) {
            if (container.id == selectionID) {
                container.selected();
            } else {
                container.unselected();
            }
        }
    }

    changeTimeScale() {
        const newTimeScale = this.getValue("Time Scale");
        this.simulation.setTimeScale(newTimeScale);
    }

    /* General Settings Callbacks */
    changeMIDIInput() {
        let newMIDIInput = this.settings.getValue("MIDI Input Device").value;
        this.simulation.MIDIIn_controller.changeMIDIIn(newMIDIInput);
    }

    changeMIDIOutput() {
        let newMIDIOutput = this.settings.getValue("MIDI Output Device").value;
        this.simulation.MIDIOut_controller.changeMIDIOut(newMIDIOutput);
    }
    backgroundColor() {}

    /* UTILITIES */
    getValue(title) {
        return this.gui.getValue(title)
    }

    output(name, value) {
        console.log(name, value)
    }

    mouseHovering() {
        
        if (this.gui.mouseHovering("gui")) {
            return true
        } else if (!this.settings._hidden && this.settings.mouseHovering("settings")) {
            return true
        } else if (!this.info._hidden && this.info.mouseHovering("instructions")) {
            return true
        }
    }

    updateContainersList() {
        this.gui.removeControl("Container Editor")
        let containerIDs = ["New Container"]

        for(const container of this.simulation.containers) {
            containerIDs.push(container.id + 1)
        }

        this.gui.addDropDown(
            "Container Editor",
            containerIDs,
            this.changeContainers.bind(this)
        )
    }
}