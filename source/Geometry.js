export function vectorPerpendicular(p1, p2) {
    return vectorNormal(p1, p2).rotate(90);
}

export function vectorNormal(p1, p2) {
    return p2.subtract(p1).normalize();
}

export function updatePoint(point, dp) {
    point.x += dp.x;
    point.y += dp.y;
}

export function isPointBetween(p, p1, p2) {

    let pp1 = p.subtract(p1);
    let p2p1 = p2.subtract(p1);

    return pp1.angle === p2p1.angle
        && pp1.length < p2p1.length;
}

export function nearestCornerToPoint(rect, p){

    let points = [
        rect.topLeft,
        rect.bottomLeft,
        rect.bottomRight,
        rect.topCenter,
        rect.bottomCenter,
        rect.leftCenter
    ];

    let tp = points[0];
    let dist = p.getDistance(tp);
    points.map(ep => {
        let _dt = p.getDistance(ep);
        if( _dt < dist){
            tp = ep;
            dist = _dt;
        }
    });
    
    return tp;
}