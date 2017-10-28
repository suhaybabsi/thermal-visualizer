import Paper from "paper";
import * as diagram from "./Diagram";
import * as drawing from "./Drawing";
import * as geometry from "./Geometry";

export const FlowType = {
    Gas: 0,   // Fluid, Gas
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
        let cp = new Point(sp.x, ep.y);
        this.points = [cp];

        this.srcOutlet.connect(this);
        this.destOutlet.connect(this);
        this.childrens = [];
        this.handles = [];
        
        this.render();
        this.setupHandles();

        diagram.addFlow(this);
    }

    remove() {
        if (this.border) { this.border.remove(); }
        this.childrens.map(child => child.remove());
        this.childrens = null;
        diagram.removeFlow(this);
    }

    analyzeEndPoints() {

        let p1 = this.srcOutlet.location();
        let p2 = this.destOutlet.location();

        let cp1 = this.points[0];
        let cp2 = this.points[this.points.length - 1];

        this.startCommitedProp = Math.abs(p1.x - cp1.x) < 0.1 ? "x" : "y";
        this.endCommitedProp = Math.abs(p2.x - cp2.x) < 0.1 ? "x" : "y";
    }

    alignPathToEndPoint(ep, isStart) {

        let p = (isStart) ? this.points[0] : this.points[this.points.length - 1];
        let alignProp = (isStart) ? this.startCommitedProp : this.endCommitedProp;
        p[alignProp] = ep[alignProp];
    }

    getAllPoints() {
        let sp = this.srcOutlet.location();
        let ep = this.destOutlet.location();
        return [sp, ...this.points, ep];
    }

    translatePoints(dp) {

        this.points = this.points.map(p => {
            return p.add(dp);
        });

        this.updateStarted();
        this.render();
        this.updateEnded();
    }

    updateStarted(handle) {
        if (this.border) { this.border.remove(); }
        if (!handle) { this.analyzeEndPoints(); }
        this.handles.map(hdle => {
            hdle.locked = (handle && hdle != handle) || !handle
        } );
    }

    updateEnded() {
        this.cleanInnerPoints();
        this.setupHandles();
        this.handles.map(handle => handle.locked = false);
    }

    setupHandles() {

        diagram.flowLayer.activate();
        let allPoints = this.getAllPoints();

        let handlesNum = 0;
        for (let i = 1; i < allPoints.length; i++) {

            let handle = this.handles[i - 1] || new FlowHandle(this);
            this.handles[i - 1] = handle;

            let p1 = allPoints[i - 1];
            let p2 = allPoints[i];

            handle.install(p1, i === 1, p2, i === (allPoints.length - 1));
            handlesNum++;
        }

        for (let i = handlesNum; i < this.handles.length; i++) {
            let handle = this.handles[i];
            handle.delete();
        }

        this.handles.splice(handlesNum);
        diagram.baseLayer.activate();
    }

    cleanInnerPoints() {

        let pointsToBeRemoved = [];
        for (let i = 1; i < this.points.length; i++) {
            let p1 = this.points[i - 1];
            let p2 = this.points[i];
            if (p1.equals(p2)) {
                pointsToBeRemoved.push(p1);
                pointsToBeRemoved.push(p2);
            }
        }

        this.points = this.points.filter(point => pointsToBeRemoved.indexOf(point) === -1);
        if (this.points.length === 0) {
            this.points.push(this.srcOutlet.location());
        }
    }

    renderBorder() {

        diagram.flowLayer.activate();

        let border;
        let allPoints = this.getAllPoints();

        for (let i = 1; i < allPoints.length; i++) {

            let p1 = allPoints[i - 1];
            let p2 = allPoints[i];

            let rect = drawing.tiltedRoundRect(p1, p2, 10);

            if (border) {
                border = border.unite(rect);
            } else {
                border = rect;
            }
        }

        border.strokeWidth = 1.0;
        border.strokeColor = "green";
        border.dashArray = [5.0, 3.0];
        this.border = border;

        diagram.baseLayer.activate();
    }

    render(isHandle = false) {

        let p1 = this.srcOutlet.location();
        let p2 = this.destOutlet.location();

        if (!isHandle) {
            this.alignPathToEndPoint(p1, true);
            this.alignPathToEndPoint(p2, false);
        }

        let color = new Color(.9, .3, .1, .8);

        diagram.flowLayer.activate();

        this.childrens.map(child => child.remove());
        this.childrens.splice(0);

        let path = new Path();
        path.strokeColor = color;
        path.strokeWidth = 1.5;
        path.moveTo(p1);
        path.locked = true;

        let ps = p1;
        this.points.map(p => {
            path.lineTo(p);
            ps = p;
        });

        path.lineTo(p2);
        let pe = p2;

        let node = new Path.Circle(p1, 4);
        node.fillColor = color;
        node.locked = true;

        let arrow = drawing.createArrowHead(ps, pe, color);
        arrow.locked = true;

        node.sendToBack();
        arrow.sendToBack();
        path.sendToBack();
        this.childrens.push(path, node, arrow);

        diagram.baseLayer.activate();
    }
}

class FlowHandle extends Paper.Group {

    constructor(flow) {
        super()
        this.flow = flow;

        this.on("mousedrag", function (ev) {
            if (!diagram.doDragGrid) {
                this.update(ev.delta);
                this.flow.render(true);
            }
        }.bind(this));

        this.on("mousedown", function (ev) {
            this.dragging = true;
            this.flow.updateStarted(this);
        }.bind(this));

        this.on("mouseup", function (ev) {
            this.dragging = false;
            if (this.flow) {
                this.flow.updateEnded();
            }
        }.bind(this));

        this.on("mouseenter", function (ev) {
            this.opacity = 1;
        }.bind(this));

        this.on("mouseleave", function (ev) {
            this.opacity = this.dragging ? 1 : 0;
        }.bind(this));
    }

    delete() {
        this.remove();
        this.sp = null;
        this.ep = null;
        this.flow = null;
        this.hasStart = false;
        this.hasEnd = false;
        this.off({
            mouseup: true,
            mousedown: true,
            mousedrag: true,
            mouseenter: true,
            mouseleave: true
        });
    }

    update(dp) {

        let mdp = this.isVertical ? new Point(dp.x, 0) : new Point(0, dp.y);

        if (this.hasStart) {
            this.hasStart = false;
            this.sp = this.sp.add(mdp);
            this.flow.points.splice(0, 0, this.sp);
        } else {
            geometry.updatePoint(this.sp, mdp);
        }

        if (this.hasEnd) {
            this.hasEnd = false;
            this.ep = this.ep.add(mdp);
            this.flow.points.push(this.ep);
        } else {
            geometry.updatePoint(this.ep, mdp);
        }

        this.position = this.position.add(mdp);
    }

    install(p1, isStart, p2, isEnd) {
        this.sp = p1;
        this.ep = p2;
        this.hasStart = isStart;
        this.hasEnd = isEnd;
        this.opacity = 0;

        let dp = p1.subtract(p2).abs();
        this.isVertical = dp.x < dp.y;
        this.render();
    }

    render() {

        this.removeChildren();
        let rect = drawing.tiltedRoundRect(this.sp, this.ep, 8);
        rect.fillColor = new Color(1, 0, 0, 0.4);
        this.addChild(rect);
    }
}