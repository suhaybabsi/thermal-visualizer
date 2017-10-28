import Paper from "paper";

/*
 * Grid Layer
 */

let gridLayer, baseLayer;
export function setup(glayer, blayer) {

    gridLayer = glayer;
    baseLayer = blayer;
    recreate();
}

export function recreate(){
    createGridLinesSymbols();
    redraw();
}

var majorHLineSym, majorVLineSym, minorHLineSym, minorVLineSym;
function createGridLinesSymbols() {

    const major_grid_style = {
        strokeColor: new Color(0.75, 0.85, 0.65, 1),
        strokeWidth: 0.8
    };

    const minor_grid_style = {
        strokeColor: new Color(0.75, 0.85, 0.65, 1),
        strokeWidth: 1.0,
        dashArray: [1, 2]
    };

    var fw = project.view.size.width;
    var fh = project.view.size.height;

    var majorHLine = new Path.Line(
        new Point(0, 0),
        new Point(fw, 0));
    majorHLine.locked = true;
    majorHLine.style = major_grid_style;

    var majorVLine = new Path.Line(
        new Point(0, 0),
        new Point(0, fh));
    majorVLine.locked = true;
    majorVLine.style = major_grid_style;

    majorHLineSym = new Symbol(majorHLine, true);
    majorVLineSym = new Symbol(majorVLine, true);

    var minorHLine = new Path.Line(
        new Point(0, 0),
        new Point(fw, 0));
    minorHLine.locked = true;
    minorHLine.style = minor_grid_style;

    var minorVLine = new Path.Line(
        new Point(0, 0),
        new Point(0, fh));
    minorVLine.locked = true;
    minorVLine.style = minor_grid_style;

    minorHLineSym = new Symbol(minorHLine, true);
    minorVLineSym = new Symbol(minorVLine, true);
}

function placeHGridLine(gy, major) {

    var pos = new Point(0, gy);
    var gline = (major)
        ? majorHLineSym.place(pos)
        : minorHLineSym.place(pos);
    gline.locked = true;
}

function placeVGridLine(gx, major) {
    
    var pos = new Point(gx, 0);
    var gline = (major)
        ? majorVLineSym.place(pos)
        : minorVLineSym.place(pos);
    gline.locked = true;
}

export function redraw() {

    gridLayer.activate();
    gridLayer.removeChildren();

    var fw = project.view.size.width;
    var fh = project.view.size.height;
    var xi = - baseLayer.pivot.x;
    var yi = - baseLayer.pivot.y;
    var xf = xi + fw;
    var yf = yi + fh;

    var dx = 15;
    var dy = 15;

    /*
    *  Vertical Lines
    */
    var gi = 0;
    var cursor = 0;
    if (cursor < xi) {
        cursor = Math.ceil(xi / dx) * dx;
    }
    while (cursor < xf) {

        var c = cursor - xi;

        if (Math.abs(cursor) % (5 * dx) === 0) {
            placeVGridLine(c, true);
        } else {
            placeVGridLine(c);
        }

        cursor += dx;
        gi++;
    }

    gi = 0;
    cursor = -dx;
    while (cursor > xi) {

        var c = cursor - xi;

        if (Math.abs(cursor) % (5.0 * dx) === 0) {
            placeVGridLine(c, true);
        } else {
            placeVGridLine(c);
        }

        cursor -= dx;
        gi++;
    }
    /*
     *  Horizontal Lines
     */
    gi = 0;
    cursor = 0;
    if (cursor < yi) {
        cursor = Math.ceil(yi / dy) * dy;
    }
    while (cursor < yf) {

        var c = cursor - yi;

        if (Math.abs(cursor) % (5.0 * dy) === 0) {
            placeHGridLine(c, true);
        } else {
            placeHGridLine(c);
        }

        cursor += dy;
        gi++;
    }

    gi = 0;
    cursor = -dy;
    while (cursor > yi) {
        var c = cursor - yi;

        if (Math.abs(cursor) % (5.0 * dy) === 0) {
            placeHGridLine(c, true);
        } else {
            placeHGridLine(c);
        }

        cursor -= dy;
        gi++;
    }

    baseLayer.activate();
}
