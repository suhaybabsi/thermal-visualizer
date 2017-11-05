import * as geometry from "./Geometry";
import Paper from "paper";

export function createArrowHead(ps, pe, ac, aw, ah) {

    var w = (aw) ? aw : 10;
    var h = (ah) ? ah : 10;
    var color = (ac) ? ac : 'black';

    var head = new Path();
    head.fillColor = color;
    head.moveTo(0, 0);
    head.lineTo(-w, -h / 2.0);
    head.lineTo(-w, h / 2.0);
    head.closePath();
    head.pivot = new Point(0, 0);

    var ang = pe.subtract(ps).angle;
    head.rotate(ang);
    head.position = pe;

    return head;
}

export function tiltedRoundRect(p1, p2, w) {

    let len = p2.subtract(p1).length;
    let ang = p2.subtract(p1).angle;

    let t = w / 2.0;
    let pp = geometry.vectorPerpendicular(p1, p2);
    let nn = geometry.vectorNormal(p1, p2);

    let ap1 = p1.subtract(pp.multiply(t)).subtract(nn.multiply(t));

    let rect = new Rectangle(ap1, new Size(len + w, w));
    let rectPath = new Path.Rectangle(rect, t);
    rectPath.rotate(ang, ap1);

    return rectPath;
}