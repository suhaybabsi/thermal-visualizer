import Paper from "paper";
import Device from "./Device";
import * as diagram from "./Diagram";
import * as Actions from "./Actions";

class IconButton extends Paper.Group {

    constructor(iconName) {
        diagram.overlayLayer.activate();
        super();
        let path = new Path.Rectangle(new Rectangle(0, 0, 30, 30), 5);
        path.fillColor = "#eee";
        this.addChild(path);
        this.path = path;

        let icon = diagram.getImageInstance(iconName);
        icon.position = path.bounds.center;

        this.addChild(icon);
        this.pivot = this.bounds.topLeft;
        this.on("mouseenter", this.mouseEntered);
        this.on("mouseleave", this.mouseLeave);
        diagram.baseLayer.activate();
    }

    mouseEntered() {
        this.path.fillColor = "#ccc";
        diagram.useHandCursor();
    }
    mouseLeave() {
        this.path.fillColor = "#eee";
        diagram.resetCursor();
    }
}

class DeviceControls extends Paper.Group {

    constructor() {
        super();

        this.currentDevice = null;
        this.editBtn = new IconButton("edit");
        this.rotateBtn = new IconButton("rotate");
        this.deleteBtn = new IconButton("delete");

        let m = 3;

        this.editBtn.position = new Point(m, m);
        this.rotateBtn.position = new Point(30 + 2 * m, m);
        this.deleteBtn.position = new Point(2 * 30 + 3 * m, m);

        let path = new Path.Rectangle(
            new Rectangle(0, 0, 3 * (m + 30) + m, m + 30 + m), 5);

        path.fillColor = "white";
        path.shadowColor = new Color(0, 0, 0, 0.4);
        path.shadowBlur = 4;
        path.shadowOffset = new Point(0, 1);

        this.addChild(path);
        this.addChild(this.editBtn);
        this.addChild(this.rotateBtn);
        this.addChild(this.deleteBtn);
        this.pivot = new Point(0, 0);

        this.editBtn.on("click", this.editDevice.bind(this))
        this.rotateBtn.on("click", this.rotateDevice.bind(this))
        this.deleteBtn.on("click", this.deleteDevice.bind(this));
    }

    presentForDevice(device) {
        this.isShown = true;
        this.currentDevice = device;
        this.position = device.bounds.bottomLeft.add(new Point(-5, 10));
        diagram.overlayLayer.addChild(this);
    }

    editDevice() {
        Actions.showEditorForDevice(this.currentDevice);
    }

    rotateDevice() {

        let isConnected = this.currentDevice.shaftCouplings.filter(cpl => {
            return cpl.shaft != null;
        }).length > 0;

        if(!isConnected){
            this.currentDevice.turn();
            drawSelectionBorder(this.currentDevice);
        }
    }

    deleteDevice() {
        diagram.deleteDevice(this.currentDevice);
        this.dismiss();
        removeSelection();
    }

    dismiss() {
        this.currentDevice = null;
        this.remove();
        this.isShown = false;
    }
}

var controls;
function insureControls(){
    
    if(controls == null){

        controls = new DeviceControls();
        controls.dismiss();
    
        project.view.on("mousedown", function (e) {
    
            if (controls.isShown) {
    
                if(!controls.contains(e.point) 
                && !controls.currentDevice.contains(e.point)) {
    
                    controls.dismiss();
                    removeSelection();
                }
            }
        });
    }
}

var selectionShape;
var selectedDevice;
export function selectDevice(device) {

    insureControls();
    controls.presentForDevice(device);
    selectedDevice = device;
    drawSelectionBorder(device);
}

function drawSelectionBorder(shape){

    if (selectionShape) {
        selectionShape.remove();
    }
    
    selectionShape = new Path.Rectangle(shape.bounds.expand(10));
    selectionShape.strokeWidth = 1.0;
    selectionShape.strokeColor = new Color(1, 0, 0, 0.6);
    selectionShape.dashArray = [2, 2];
}

export function removeSelection() {

    if (selectedDevice) {
        selectionShape.remove();
        selectionShape = null;
        selectedDevice = null;
    }
}