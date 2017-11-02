import Paper from "paper";
import * as diagram from "./Diagram";
import * as drawing from "./Drawing";
import * as geometry from "./Geometry";
import { units } from "./Setup";

export const FlowType = {
    Stream: 0,
    Pipe: 1
}

export const FlowDirection = { IN: 0, OUT: 1 }
export class FlowOutlet {

    constructor(type, direction, device, delta) {
        this.device = device;
        this.delta = delta;
        this.type = type;
        this.direction = direction;
        this.flow = null;
    }

    connect(flow) {
        this.flow = flow;
    }

    disconnect() {
        this.flow = null;
    }

    isConnected() {
        return this.flow != null;
    }

    location() {
        return this.device.position.add(this.delta);
    }

    clear(){
        delete this.device;
        delete this.delta;
        delete this.type;
        delete this.direction;
        delete this.flow;
    }
}


function calculateDimensions(p1, p2) {

    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;

    let sx = (dx != 0) ? dx / Math.abs(dx) : 1;
    let sy = (dy != 0) ? dy / Math.abs(dy) : 1;

    let tx = Math.min(Math.abs(dx * 0.25), 10) * sx;
    let ty = Math.min(Math.abs(dy * 0.25), 10) * sy;

    return { dx, dy, tx, ty };
}

function verticallyWindingPath(path, p1, p2) {

    let { dx, tx, ty } = calculateDimensions(p1, p2);
    let pc11, pc1, pc12, pc21, pc2, pc22;

    pc11 = p1.add(new Point(dx * 0.5 - tx, 0));
    pc1 = p1.add(new Point(dx * 0.5, 0));
    pc12 = p1.add(new Point(dx * 0.5, ty));

    pc21 = p2.add(new Point(-dx * 0.5 + tx, 0));
    pc2 = p2.add(new Point(-dx * 0.5, 0));
    pc22 = p2.add(new Point(-dx * 0.5, -ty));

    path.moveTo(p1);
    path.lineTo(pc11);
    path.quadraticCurveTo(pc1, pc12);

    path.lineTo(pc22);
    path.quadraticCurveTo(pc2, pc21);
    path.lineTo(p2);

    return [pc11, pc1, pc12, pc22, pc2, pc21];
}

function horizontallyWindingPath(path, p1, p2) {

    let { dy, tx, ty } = calculateDimensions(p1, p2);
    let pc11, pc1, pc12, pc21, pc2, pc22;

    pc11 = p1.add(new Point(0, dy * 0.5 - ty));
    pc1 = p1.add(new Point(0, dy * 0.5));
    pc12 = p1.add(new Point(tx, dy * 0.5));

    pc21 = p2.add(new Point(0, -dy * 0.5 + ty));
    pc2 = p2.add(new Point(0, -dy * 0.5));
    pc22 = p2.add(new Point(-tx, -dy * 0.5));

    path.moveTo(p1);
    path.lineTo(pc11);
    path.quadraticCurveTo(pc1, pc12);

    path.lineTo(pc22);
    path.quadraticCurveTo(pc2, pc21);
    path.lineTo(p2);

    return [pc11, pc1, pc12, pc22, pc2, pc21];
}

function flatEndWindingPath(path, p1, p2) {

    let { dy, tx, ty } = calculateDimensions(p1, p2);

    let p1c = p1.add(new Point(0, dy - ty));
    let pc = p1.add(new Point(0, dy));
    let pc2 = p1.add(new Point(tx, dy));

    path.moveTo(p1);
    path.lineTo(p1c);
    path.quadraticCurveTo(pc, pc2);
    path.lineTo(p2);

    return [p1c, pc, pc2];
}

function flatStartWindingPath(path, p1, p2) {

    let { dx, tx, ty } = calculateDimensions(p1, p2);

    let p1c = p1.add(new Point(dx - tx, 0));
    let pc = p1.add(new Point(dx, 0));
    let pc2 = p1.add(new Point(dx, ty));

    path.moveTo(p1);
    path.lineTo(p1c);
    path.quadraticCurveTo(pc, pc2);
    path.lineTo(p2);

    return [p1c, pc, pc2];
}

let PathDrawers = [
    flatStartWindingPath,
    flatEndWindingPath,
    verticallyWindingPath,
    horizontallyWindingPath
];

export class Flow {

    constructor(from, to) {
        this.srcOutlet = from;
        this.destOutlet = to;
        this.pathDrawer = PathDrawers[0];

        if (from.direction != FlowDirection.OUT ||
            to.direction != FlowDirection.IN) {
            throw "Can't create flow from those outlets.";
        }

        let sp = this.srcOutlet.location();
        let ep = this.destOutlet.location();

        this.srcOutlet.connect(this);
        this.destOutlet.connect(this);
        this.childrens = [];
        this.node = new ThermalNode(this);

        this.render();
        diagram.addFlow(this);
    }

    remove() {
        if (this.border) { this.border.remove(); }
        this.childrens.map(child => child.remove());
        this.childrens = null;
        this.node.remove();
        this.srcOutlet.disconnect();
        this.destOutlet.disconnect();
        this.srcOutlet = null;
        this.destOutlet = null;
        diagram.removeFlow(this);
    }

    flip() {

        let index = PathDrawers.indexOf(this.pathDrawer);
        index = ((index + 1) < PathDrawers.length) ? index + 1 : 0;
        this.pathDrawer = PathDrawers[index];
        this.render();

        return this;
    }

    displaceNode1Label(dx, dy){
        this.node.labelDisplacement = new Point(dx, dy);
        this.node.update();
        return this;
    }

    render() {

        let p1 = this.srcOutlet.location();
        let p2 = this.destOutlet.location();
        
        let type = this.srcOutlet.type;
        let color = (type == FlowType.Stream)
            ? new Color(.9, .3, .1, .8)
            : new Color(.1, .3, .9, .8);

        diagram.flowLayer.activate();

        this.childrens.map(child => child.remove());
        this.childrens.splice(0);

        let path = new Path();
        path.strokeColor = color;
        path.strokeWidth = 1.5;
        path.locked = true;

        let in_points = this.pathDrawer(path, p1, p2);
        let pe = in_points[in_points.length - 2];
        let pn = in_points[0];
        let pnn = pn.subtract(p1).normalize().multiply(15);

        this.node.firstChild.fillColor = color;
        this.node.position = p1.add(pnn);
        this.node.update();

        let arrow = drawing.createArrowHead(pe, p2, color);
        arrow.locked = true;

        arrow.sendToBack();
        path.sendToBack();

        let bPath = new Path();
        bPath.strokeColor = new Color(0, 0, 0, 0.1);
        bPath.strokeWidth = 8.0;
        bPath.flow = this;
        bPath.opacity = 0;
        bPath.on("mouseenter", function () {
            this.opacity = 1;
            diagram.useHandCursor(this);
        });
        bPath.on("mouseleave", function () {
            this.opacity = 0;
            diagram.resetCursor(this);
        });
        bPath.on("click", function () {
            this.flow.flip();
        });

        this.pathDrawer(bPath, p1, p2);
        bPath.sendToBack();

        this.childrens.push(path, arrow, bPath);

        diagram.baseLayer.activate();
    }
}

class ThermalNode extends Paper.Group {

    constructor(flow){
        super();
        this.flow = flow;
        this.label = new ThermalLabel(this);
        this.labelDisplacement = new Point(0,0);

        let circle = new Paper.Path.Circle(new Point(0 ,0), 5);
        circle.fillColor = new Color(1,0,0, 0.7);
        this.addChild(circle);
        this.label.update(flow);
    }
    
    refresh() {
        this.label.update(this.flow);
    }

    remove(){
        super.remove();
        this.label.remove();
    }

    update(){

        let p = this.position;
        this.label.position = p.add(this.labelDisplacement);
        this.label.drawLine();

        diagram.flowLayer.addChild(this.label);
    }
}


class ThermalLabel extends Paper.Group {

    constructor(node) {
        super();
        this.node = node;

        var temp = new Paper.PointText();
        temp.fontSize = 12;
        temp.fillColor = "red";
        temp.point = new Point(0, 0);

        var press = new Paper.PointText();
        press.fontSize = 12;
        press.fillColor = "red";
        press.point = new Point(0, 20);

        this.tLabel = temp;
        this.pLabel = press;
        this.pivot = new Point(0, 0);

        this.addChild(press);
        this.addChild(temp);
        this.on("mousedrag", this.dragHandler);
    }

    dragHandler(e) {

        this.position = this.position.add(e.delta);
        let dp = this.node.labelDisplacement;
        this.node.labelDisplacement = dp.add(e.delta);
        this.drawLine();
    }

    remove(){
        super.remove();
        if(this.line){ this.line.remove(); }
    }

    drawLine(){

        if(this.line){ this.line.remove(); }

        let p1 = this.node.position;
        let p2 = geometry.nearestCornerToPoint(this.bounds, p1);
        p2 = p2.subtract( p2.subtract(p1).normalize().multiply(2) );
        
        let line = new Paper.Path.Line(p1, p2);
        line.strokeColor = new Color(0, 0, 0, 0.35);
        line.dashArray = [3, 2];

        this.line = line;
    }

    update(flow) {

        let res = flow.results;
        res = (res) ? res : {};

        let tVal = (res.t) ? res.t : 0.0;
        let pVal = (res.p) ? res.p : 0.0;

        let unitT = diagram.selectedUnits.t;
        let unitP = diagram.selectedUnits.p;
        
        this.tLabel.content = "T: " + unitT.printWithLabel(tVal);
        this.pLabel.content = "P: " + unitP.printWithLabel(pVal);
        this.drawLine();
    }
}