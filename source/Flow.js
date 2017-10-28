import Paper from "paper";
import * as diagram from "./Diagram";
import * as drawing from "./Drawing";
import * as geometry from "./Geometry";

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

    isConnected() {
        return this.flow != null;
    }

    location() {
        return this.device.position.add(this.delta);
    }
}

export class Flow {

    constructor(from, to) {
        this.srcOutlet = from;
        this.destOutlet = to;

        if (from.direction != FlowDirection.OUT ||
            to.direction != FlowDirection.IN) {
            throw "Can't create flow from those outlets.";
        }

        let sp = this.srcOutlet.location();
        let ep = this.destOutlet.location();

        this.srcOutlet.connect(this);
        this.destOutlet.connect(this);
        this.childrens = [];

        this.render();
        diagram.addFlow(this);
    }

    remove() {
        if (this.border) { this.border.remove(); }
        this.childrens.map(child => child.remove());
        this.childrens = null;
        diagram.removeFlow(this);
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

        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;

        let sx = (dx != 0) ? dx / Math.abs(dx) : 1;
        let sy = (dy != 0) ? dy / Math.abs(dy) : 1;

        let tx = Math.min(Math.abs(dx * 0.25), 10) * sx;
        let ty = Math.min(Math.abs(dy * 0.25), 10) * sy;

        path.moveTo(p1);

        let pc11, pc1, pc12, pc21, pc2, pc22;
        if (type == FlowType.Stream) {

            pc11 = p1.add(new Point(dx * 0.5 - tx, 0));
            pc1 = p1.add(new Point(dx * 0.5, 0));
            pc12 = p1.add(new Point(dx * 0.5, ty));

            pc21 = p2.add(new Point(-dx * 0.5 + tx, 0));
            pc2 = p2.add(new Point(-dx * 0.5, 0));
            pc22 = p2.add(new Point(-dx * 0.5, -ty));

        } else {

            pc11 = p1.add(new Point(0, dy * 0.5 - ty));
            pc1 = p1.add(new Point(0, dy * 0.5));
            pc12 = p1.add(new Point(tx, dy * 0.5));
            
            pc21 = p2.add(new Point(0, -dy * 0.5 + ty));
            pc2 = p2.add(new Point(0, -dy * 0.5));
            pc22 = p2.add(new Point(-tx, -dy * 0.5));
        }

        path.lineTo(pc11);
        path.quadraticCurveTo(pc1, pc12);

        path.lineTo(pc22);
        path.quadraticCurveTo(pc2, pc21);
        path.lineTo(p2);

        let node = new Path.Circle(p1, 4);
        node.fillColor = color;
        node.locked = true;

        let arrow = drawing.createArrowHead(pc2, p2, color);
        arrow.locked = true;

        node.sendToBack();
        arrow.sendToBack();
        path.sendToBack();

        this.childrens.push(path, node, arrow);

        diagram.baseLayer.activate();
    }
}