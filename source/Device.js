import React from "react";
import ReactDOM from "react-dom";
import Paper from "paper";
import DeviceEditor from "./ui/DeviceEditor";
import { deviceConfigurations } from "./Setup";
import * as diagram from "./Diagram";
import { FlowType, FlowOutlet, FlowDirection } from "./Flow";

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
        this.pivot = this.bounds.topLeft;
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
        this.on("doubleclick", this.clickHandler);
        diagram.devices.push(this);
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
            text.locked = true;
            this.addChild(text);
        }
    }

    clickHandler(e) {
        ReactDOM.unmountComponentAtNode(editorElm);
        ReactDOM.render(<DeviceEditor device={this} />, editorElm);
    }

    mouseEnterHandler(e) {
        if (!diagram.isMouseDown) {
            diagram.revealDeviceHandles(this);
        }
    }

    dragHandler(e) {

        if( !diagram.doDragGrid ) {
            let newPoint = this.position.add(e.delta);
            this.position = newPoint;
            this.updateFlows();
            this.updateShafts();
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
}