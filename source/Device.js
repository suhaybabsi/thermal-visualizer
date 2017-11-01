import React from "react";
import ReactDOM from "react-dom";
import Paper from "paper";
import DeviceEditor from "./ui/DeviceEditor";
import { deviceConfigurations } from "./Setup";
import * as diagram from "./Diagram";
import { FlowType, FlowOutlet, FlowDirection } from "./Flow";
import { ShaftOrientation } from "./Shaft";

const editorElm = document.getElementById("editor-layer");

export default class Device extends Paper.Group {

    constructor(type, model) {
        diagram.baseLayer.activate();
        super();

        let config = deviceConfigurations[type];
        if (!model) {
            model = {};
            config.fields.map(field => {
                model[field.prop] = field.sample;
            });
        }

        this.config = config;
        this.model = model;
        this.type = type;
        this.name = config.name + " 1";
        this.pivot = new Point(0, 0);
        this.results = null;

        if (config.outlets) {
            this.flowOutlets = config.outlets.map(outConfig => {
                return outConfig.createOutlet(this);
            });
        } else {
            this.flowOutlets = [];
        }

        if (config.couplings) {
            this.shaftCouplings = config.couplings.map(cplConfig => {
                return cplConfig.createCoupling(this);
            });
        } else {
            this.shaftCouplings = [];
        }

        this.build(config);
        this.on("mouseenter", this.mouseEnterHandler);
        this.on("mousedrag", this.dragHandler);
        this.on("doubleclick", this.doubleClickHandler);
        this.on("click", this.clickHandler);
        diagram.devices.push(this);
    }

    getShaftEnter(cpl) {
        var hp = (cpl.isHorizontal())
            ? new Point(this.bounds.width * 0.5, 0)
            : new Point(0, this.bounds.height * 0.5);

        return cpl.location().subtract(hp);
    }

    getShaftExit(cpl) {
        var hp = (cpl.isHorizontal())
            ? new Point(this.bounds.width * 0.5, 0)
            : new Point(0, this.bounds.height * 0.5);

        return cpl.location().add(hp);
    }

    build(config) {

        let shape = this.config.build();
        shape.shadowBlur = 2;
        shape.shadowOffset = new Point(2, 2);
        shape.shadowColor = new Color(0, 0, 0, 0.4);
        this.addChild(shape);

        if (config.abbrev) {

            let text = new Paper.PointText();
            text.content = config.abbrev;
            text.fontSize = 15;
            text.fillColor = "white";
            text.justification = "center";
            text.pivot = text.bounds.center;
            text.position = this.bounds.center;
            this.text = text;
            this.addChild(text);
        }
    }

    doubleClickHandler(e) {
        ReactDOM.unmountComponentAtNode(editorElm);
        ReactDOM.render(<DeviceEditor device={this} />, editorElm);
        woopra.track("device_edited", { type: this.type });
    }

    clickHandler(e) {}
    mouseEnterHandler(e) {
        if (!diagram.isMouseDown) {
            diagram.revealDeviceHandles(this);
        }
    }

    dragHandler(e) {

        if (!diagram.doDragGrid) {
            let newPoint = this.position.add(e.delta);
            this.position = newPoint;
            this.updateFlows();
            this.updateShafts();
            console.log(newPoint);
        }
    }

    updateFlows() {
        this.flowOutlets.map((outlet, i) => {
            if (outlet.flow) {
                outlet.flow.render();
            }
        });
    }

    updateShafts() {
        this.shaftCouplings.map(cpl => {
            if (cpl.shaft) {
                cpl.shaft.render(this);
            }
        })
    }

    updateLocation(point) {
        this.position = point;
        this.updateFlows();
    }

    performRotation(ang) {

        let cp = this.bounds.center;
        let pos = this.position.rotate(ang, cp);
        this.flowOutlets.map(op => {
            let dest = op.location();
            op.delta = dest.rotate(ang, cp).subtract(pos);
        });

        this.shaftCouplings.map(cpl => {
            if(cpl.orientation == ShaftOrientation.Horizontal){
                cpl.orientation = ShaftOrientation.Vertical;
            } else {
                cpl.orientation = ShaftOrientation.Horizontal;
            }
        });

        this.rotate(ang, cp);
        let dp = this.pivot.subtract(this.bounds.topLeft);
        this.pivot = this.bounds.topLeft;

        this.flowOutlets.map(op => {
            op.delta = op.delta.add(dp);
            if(op.flow){ op.flow.render(); }
        });

        if(this.text){
            this.text.rotate(-ang);
        }
    }

    turn(times = 1){

        let num = (times > 0) ? times : 1;
        for(var i=0; i < num; i++){
            this.performRotation(90);
        }
        return this;
    }
}