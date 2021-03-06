import Paper from "paper";
import * as diagram from "./Diagram";

export function circle(color, radius) {

    let r = (radius) ? radius : 25;

    return () => {

        let crcle = new Paper.Path.Circle(new Point(r, r), r)
        crcle.fillColor = color;
        crcle.strokeColor = new Color(1, 1, 1, 0.5);
        crcle.strokeWidth = 1;
        crcle.pivot = new Point(0, 0);

        return crcle;
    }
}

export function outlineCircle(color, width, radius) {

    let r = (radius) ? radius : 25;

    return () => {

        let crcle = new Paper.Path.Circle(new Point(r, r), r)
        crcle.fillColor = new Color(0, 0, 0, 0.01);
        crcle.strokeColor = color;
        crcle.strokeWidth = width;
        crcle.pivot = new Point(0, 0);

        return crcle;
    }
}

export function rectangle(color, w, h) {

    let wt = (w) ? w : 60;
    let ht = (h) ? h : 50;

    return () => {

        let rect = new Paper.Rectangle(0, 0, wt, ht);
        let rectShp = new Paper.Path.Rectangle(rect);
        rectShp.fillColor = color;
        rectShp.strokeColor = new Color(1, 1, 1, 0.5);
        rectShp.strokeWidth = 1;
        rectShp.pivot = new Point(0, 0);

        return rectShp;
    }
}

export function rhomboid(color, orientation, width, height, margin) {

    let w = (width) ? width : 70;
    let h = (height) ? height : 60;
    let m = (margin) ? margin : 20;
    let o = (orientation) ? orientation : "left";

    return () => {

        let path = new Paper.Path()
        if (o === "left") {

            path.moveTo(new Point(0, 0));
            path.lineTo(new Point(w, m));
            path.lineTo(new Point(w, h - m));
            path.lineTo(new Point(0, h));
            path.closePath();

        } else {

            path.moveTo(new Point(0, m));
            path.lineTo(new Point(w, 0));
            path.lineTo(new Point(w, h));
            path.lineTo(new Point(0, h - m));
            path.closePath();
        }

        path.fillColor = color;
        path.strokeColor = new Color(1, 1, 1, 0.5);
        path.strokeWidth = 1;
        return path;
    }
}

export function arrow(color, orientation, width, height, head_width, head_margin) {

    let w = (width) ? width : 70;
    let h = (height) ? height : 40;
    let hw = (head_width) ? head_width : w * 0.50;
    let hm = (head_margin) ? head_margin : 11;
    let o = (orientation) ? orientation : "left";

    return () => {

        let path = new Paper.Path()
        if (o === "left") {

            path.moveTo(new Point(0, 0.5 * h));
            path.lineTo(new Point(hw, 0));
            path.lineTo(new Point(hw, hm));
            path.lineTo(new Point(w, hm));
            path.lineTo(new Point(w, h - hm));
            path.lineTo(new Point(hw, h - hm));
            path.lineTo(new Point(hw, h));
            path.closePath();

        } else {

            path.moveTo(new Point(0, hm));
            path.lineTo(new Point(w - hw, hm));
            path.lineTo(new Point(w - hw, 0));
            path.lineTo(new Point(w, 0.5 * h));
            path.lineTo(new Point(w - hw, h));
            path.lineTo(new Point(w - hw, h - hm));
            path.lineTo(new Point(0, h - hm));
            path.closePath();

        }

        path.fillColor = color;
        path.strokeColor = new Color(1, 1, 1, 0.5);
        path.strokeWidth = 1;
        return path;
    }
}

export function image(img_name) {
    return () => {
        return diagram.getImageInstance(img_name);
    }
}
    