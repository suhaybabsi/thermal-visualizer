import Paper from "paper";
import * as geometry from "./Geometry";
import * as diagram from "./Diagram";
import * as drawing from "./Drawing";
import { units } from "./Setup";

export const ShaftOrientation = {
    Horizontal: 0,
    Vertical: 1
}

export class Coupling {

    constructor(offset, orientation, device) {
        this.offset = offset;
        this.orientation = orientation;
        this.device = device;
        this.shaft = null;
    }

    isHorizontal(){
        return this.orientation == ShaftOrientation.Horizontal;
    }

    location() {
        let bounds = this.device.bounds;
        let delta;
        if( this.isHorizontal() ) {
            delta = new Point(bounds.width / 2.0, this.offset);
        }else {
            delta = new Point(this.offset, bounds.height / 2.0);
        }
        return this.device.position.add(delta);
    }

    isConnected() {
        return (this.shaft !== null);
    }

    delete() {

        delete this.offset;
        delete this.orientation;
        delete this.device;
        if (this.shaft) {
            this.shaft.removeCoupling(this);
            delete this.shaft;
        }
    }
}

export class Shaft {

    constructor() {
        this.couplings = [];
        diagram.addShaft(this);
    }

    isHorizontal(){
        return (this.orientation == ShaftOrientation.Horizontal);
    }

    addCoupling(cpl) {
        this.orientation = cpl.orientation;
        this.couplings.push(cpl);
        cpl.shaft = this;
    }

    getDeviceCoupling(device) {

        for (var c in this.couplings) {
            var cpl = this.couplings[c];
            var cd = cpl.device;
            if (cd === device) {
                return cpl;
            }
        }
        return this.couplings[0];
    }

    render(dvc) {

        var cdp_0 = this.getDeviceCoupling(dvc).location();
        var cplPoints = [];
        for (var c in this.couplings) {
            var cpl = this.couplings[c];
            var cd = cpl.device;
            if (cd !== dvc) {
                var cdp = cpl.location();
                var cdl = cd.position.clone();

                if ( this.isHorizontal() ) {
                    cdl.y += cdp_0.y - cdp.y;
                } else {
                    cdl.x += cdp_0.x - cdp.x;
                }
                cd.updateLocation(cdl);
            }

            cplPoints.push(cpl);
        }

        var shaft_orientation = this.orientation;
        var pointCompare = function (p1, p2) {
            if (shaft_orientation == ShaftOrientation.Horizontal) {
                return p1.location().x - p2.location().x;
            } else {
                return p1.location().y - p2.location().y;
            }
        };
        cplPoints.sort(pointCompare);

        this.startPoint = cplPoints[0];
        this.endPoint = cplPoints[cplPoints.length - 1];

        var pi = cplPoints[0].location();
        var pg = cplPoints[0].location();
        var pf = cplPoints[cplPoints.length - 1].location();

        var t = 8;
        var dp = ( this.isHorizontal() ) ? new Point(0, t / 2) : new Point(t / 2, 0);
        pi = pi.subtract(dp);
        pg = pg.add(dp);
        pf = pf.add(dp);

        this.clearShape();

        diagram.shaftLayer.activate();
        
        this.path = new Path.Rectangle(pi, pf);
        this.path.locked = true;
        this.path.style = {
            fillColor: {
                gradient: {
                    stops: [[.3, .3, .3, .8], [.6, .6, .6, .8]]
                },
                origin: pi,
                destination: pg
            },
            strokeColor: [.4, .4, .4],
            strokeWidth: 1
        };

        diagram.baseLayer.activate();
        this.showResults();
    }

    showResults() {

        diagram.shaftLayer.activate();
        var unit = units.w[0];
        var options = {
            justification: 'left',
            fontFamily: 'sans-serif',
            fillColor: '#66f',
            locked: true
        };

        if (!this.results) { return; }
        if (this.rlabels) {
            for (var l in this.rlabels) {
                this.rlabels[l].remove();
            }
        }

        var rlabels = [];
        for (var i = 0; i < this.couplings.length; i++) {

            var cp = this.couplings[i];
            var rs = this.results[i];
            var dc = cp.device;

            var sp = this.startPoint.location();
            var ep = this.endPoint.location();

            var p1 = dc.getShaftEnter(cp);
            var p2 = dc.getShaftExit(cp);

            var av = p2.subtract(p1);
            av.length = 25;
            var ld = av.clone();
            ld.angle += 50;

            var ap, bp, just;
            if ( geometry.isPointBetween(p1, sp, ep) ) {
                ap = p1;
                bp = p1.subtract(av);
                ld.length = -25;
            } else {
                ap = p2;
                bp = p2.add(av);
                ld.length = 25;
            }

            function dim(p, d) {
                var cd = d.replace('-', '');
                var val = p[cd];
                val = (d.indexOf('-') === 0) ? -val : val;
                return val;
            }

            var jd = ( this.isHorizontal() ) ? '-x' : 'y';
            var just = dim(ap, jd) < dim(bp, jd) ? 'right' : 'left';

            var rl = new PointText(options);
            rl.content = unit.printWithLabel(rs);
            rl.pivot = rl.bounds[just + "Center"];
            rl.position = ap.add(ld);

            var lcolor = new Color(.3, .3, .9);

            ld.length = 11;
            var ls = ap.add(ld);
            var le = bp.add(ld);

            var line = new Path.Line(ls, le);
            line.strokeColor = lcolor;
            line.strokeWidth = 1.0;
            
            var ar = drawing.createArrowHead(ls, le, lcolor, 7, 6);

            rlabels.push(rl);
            rlabels.push(line);
            rlabels.push(ar);
        }
        
        this.rlabels = rlabels;
        diagram.baseLayer.activate();
    }

    clearShape() {

        if (this.path) {
            this.path.remove();
        }
        if (this.rlabels) {
            for (var l in this.rlabels) {
                this.rlabels[l].remove();
            }
        }
    }

    delete() {

        this.couplings.map( cpl => cpl.shaft = null );
        this.couplings = null;

        this.clearShape();
        this.path = null;
        this.rlabels = null;
        diagram.removeShaft(this);
    }

    removeCoupling(cpl) {

        if (this.couplings.length === 2) {
            this.delete();
        } else {
            
            var index = this.couplings.indexOf(cpl);
            this.couplings.splice(index, 1);

            if (this.results) {
                this.results.splice(index, 1);
            }

            this.render();
        }
    }
}