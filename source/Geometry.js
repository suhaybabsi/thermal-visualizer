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