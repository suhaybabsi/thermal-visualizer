import { units } from "./Setup";
import * as grid from "./Grid";
import { FlowType, FlowOutlet, FlowDirection, Flow } from "./Flow";
import { Coupling, Shaft } from "./Shaft";
import Paper from "paper";

export var selectedUnits = {},
    isDevicesIconsLoaded = false,
    isUIElementsLoaded = false,
    isDocumentFullyLoaded = false,
    listeners = {},
    devices = [],
    flows = [],
    shafts = [],
    annotationLayer,
    shaftLayer,
    flowLayer,
    baseLayer,
    gridLayer;

export function addFlow(flow) {
    flows.push(flow);
}

export function removeFlow(flow) {
    flows = flows.filter(dflow => {
        return dflow !== flow;
    });
}

export function addShaft(shaft) {
    shafts.push(shaft);
}

export function removeShaft(shaft) {
    shafts = shafts.filter(dshaft => {
        return dshaft !== shaft;
    });
}

export function defaultUnits() {
    selectedUnits.m = units.m[0];
    selectedUnits.p = units.p[0];
    selectedUnits.t = units.t[0];
    selectedUnits.w = units.w[0];
    selectedUnits.x = units.x[0];
}

export function hasDefaultUnits() {

    var mi = units.m.indexOf(selectedUnits.m);
    var pi = units.p.indexOf(selectedUnits.p);
    var ti = units.t.indexOf(selectedUnits.t);
    var wi = units.w.indexOf(selectedUnits.w);
    var xi = units.x.indexOf(selectedUnits.x);
    return mi === 0 && pi === 0
        && ti === 0 && wi === 0
        && xi === 0;
}

export function on(ev, func) {

    if (listeners.hasOwnProperty(ev)) {
        listeners[ev].push(func);
    } else {
        listeners[ev] = [func];
    }
}

function executeListenersOfEvent(e_name, e_data) {

    if (listeners.hasOwnProperty(e_name)) {
        var ev_listeners = listeners[e_name];
        for (var i = 0; i < ev_listeners.length; i++) {
            var listener = ev_listeners[i];
            listener(e_data);
        }
    }
}

export function update() {

    flows.map((flow, i) => {
        flow.render();
    });

    view.update();
}

export function viewCenter() {
    return view.bounds.center;
}

function loadAllRequiredData() {

    $.when(
        // loading assets
    ).then(function () {
        console.log("Diagram loaded successfully !!");
        executeListenersOfEvent("ready");
        isDevicesIconsLoaded = true;
        // tryHideLoadingScreen();
    });
}

let tool;
export function setup() {

    Paper.install(window);
    $(document).ready(function () {

        isDocumentFullyLoaded = true;
        Paper.setup('board');

        $(window).on("resize", function () {

            var cw = $("#board").width();
            var ch = $("#board").height();

            project.view.viewSize = new Size(cw, ch);
            update();
        });

        gridLayer = new Paper.Layer();
        flowLayer = new Paper.Layer();
        shaftLayer = new Paper.Layer();
        annotationLayer = new Paper.Layer();
        baseLayer = new Paper.Layer();

        annotationLayer.pivot = new Point(0, 0);
        gridLayer.pivot = new Point(0, 0);
        flowLayer.pivot = new Point(0, 0);
        shaftLayer.pivot = new Point(0, 0);
        baseLayer.pivot = new Point(0, 0);
        tool = new Paper.Tool();

        baseLayer.activate();
        grid.setup(gridLayer, baseLayer);

        loadAllRequiredData();
    });
}

defaultUnits();
export var isKeyDown, doDragGrid, isMouseDown;
var totalGridDelta;
on("ready", function () {

    tool.on('keydown', function (e) {

        isKeyDown = true;
        if (e.key === 'shift') {
            doDragGrid = true;
            totalGridDelta = new Point();
        }

    }).on('keyup', function (e) {
        
        isKeyDown = false;
        if (e.key === 'shift') {
            doDragGrid = false;
            totalGridDelta = null;
        }

    }).on('mousedrag', function (e) {

        if (doDragGrid) {
            baseLayer.position = baseLayer.position.add(e.delta);
            flowLayer.position = flowLayer.position.add(e.delta);
            shaftLayer.position = shaftLayer.position.add(e.delta);
            gridLayer.position = gridLayer.position.add(e.delta);
            grid.redraw();

            totalGridDelta.x += e.delta.x;
            totalGridDelta.y += e.delta.y;
        }

    }).on('mousedown', function (e) {
        isMouseDown = true;
        if (!currentHandle) {
            hideDeviceHandles();
        }
    }).on('mouseup', function (e) {
        isMouseDown = false;
        hideDeviceHandles();
        hidePossibleInlets();
        hidePossibleCouplings();
    });

    view.onResize = function (e) {
        grid.recreate();
        view.update();
    };
})

/*
 * Loading Data and Setting up diagram
 */

/*
function tryHideLoadingScreen(){
    
    var isFullyLoaded = 
            isUIElementsLoaded &&
            isDevicesIconsLoaded &&
            isDocumentFullyLoaded;
    
    if(isFullyLoaded){
        
        setTimeout(function () {
            $('#loading-wrapper').addClass('loaded');
            $('#container').css("visibility", "visible");
        }, 1000);
    }
}*/

function useHandCursor() {
    $('#board').css('cursor', 'pointer');
}
function resetCursor() {
    $('#board').css('cursor', 'auto');
}

var currentHandle;
class FlowPointHandle extends Paper.Group {

    constructor(outlet) {
        super();
        let fp = new Path.Circle(0, 0, 5);
        let bg = new Path.Circle(0, 0, 10);
        var color = new Color(.5, .5, .3);

        var fpColor = color.clone();
        fpColor.alpha = .6;
        var bgColor = color.clone();
        bgColor.alpha = .1;

        fp.fillColor = fpColor;
        bg.fillColor = bgColor;

        this.addChild(bg);
        this.addChild(fp);

        this.color = color;
        this.background = bg;
        this.position = outlet.location();
        this.outlet = outlet;

        this.on('mouseenter', this.enterHandler);
        this.on('mouseleave', this.leaveHandler);
    }

    enterHandler(e) {
        useHandCursor();
        let bgColor = this.color.clone();
        bgColor.alpha = .5;
        this.background.fillColor = bgColor;
    }

    leaveHandler(e) {
        resetCursor();
        let bgColor = this.color.clone();
        bgColor.alpha = .1;
        this.background.fillColor = bgColor;
    }

    delete() {
        this.outlet = null;
        this.removeChildren();
        this.remove();
    }
}

class OutletHandle extends FlowPointHandle {

    constructor(outlet) {
        super(outlet);
        this.on('mousedown', this.mousedownHandler);
        this.on('mousedrag', this.mousedragHandler);
    }

    mousedownHandler(e) {
        currentHandle = this;
        revealPossibleInlets(this.outlet.device, this.outlet.type);
    }

    mousedragHandler(e) {

        annotationLayer.activate();
        if (annotationLayer.line) { annotationLayer.line.remove(); }
        annotationLayer.line = new Path.Line(this.position, e.point);
        annotationLayer.line.locked = true;
        annotationLayer.line.style = {
            strokeColor: 'red',
            strokeWidth: 1,
            dashArray: [3, 3]
        };
        baseLayer.activate();
    }
}

class InletHandle extends FlowPointHandle {

    constructor(outlet) {
        super(outlet);
        this.on('mouseup', this.mouseupHandler);
    }

    mouseupHandler(e) {

        let { outlet } = currentHandle;
        let flow = new Flow(outlet, this.outlet);
        update();
    }
}

class ShaftShape extends Paper.Group {

    constructor(cpl) {

        annotationLayer.activate();
        super();
        baseLayer.activate();

        var dvc = cpl.device;
        var cap = 15;
        var sw = (cpl.isHorizontal())
            ? dvc.bounds.width
            : dvc.bounds.height;

        var w = sw + 2 * cap;
        var h = 8;

        var border = new Path.Rectangle(0, 0, w, h);
        border.locked = true;
        border.style = {
            strokeColor: new Color(.5, .5, .3, .8),
            dashArray: [4, 2],
            strokeWidth: 1
        };

        var cap1 = new Path.Rectangle(0, 0, cap, h);
        var cap2 = new Path.Rectangle(w - cap, 0, cap, h);

        cap1.style = cap2.style = {
            fillColor: {
                gradient: {
                    stops: [[.3, .3, .3, .8], [.6, .6, .6, .8]]
                },
                origin: [0, 0],
                destination: [0, h]
            },
            strokeColor: [.4, .4, .4],
            strokeWidth: 1
        };

        cap1.on('mouseenter', useHandCursor);
        cap1.on('mouseleave', resetCursor);

        cap2.on('mouseenter', useHandCursor);
        cap2.on('mouseleave', resetCursor);

        var angle = (cpl.isHorizontal()) ? 0 : -90;
        this.addChild(border);
        this.addChild(cap1);
        this.addChild(cap2);
        this.rotate(angle);

        this.coupling = cpl;
        this.position = cpl.location();
    }

    delete() {

        this.coupling = null;
        this.removeChildren();
        this.remove();
    }
}

class CouplingHandle extends ShaftShape {

    constructor(coupling) {
        super(coupling);
        this.on('mousedown', this.mousedownHandler);
        this.on('mousedrag', this.mousedragHandler);
    }

    mousedownHandler(e) {
        currentHandle = this;
        revealPossibleCouplings(this.coupling.device, this.coupling.orientation);
    }

    mousedragHandler(e) {
        annotationLayer.activate();

        if (annotationLayer.line) { annotationLayer.line.remove(); }

        annotationLayer.line = new Path.Line(this.position, e.point);
        annotationLayer.line.locked = true;
        annotationLayer.line.style = {
            strokeColor: 'red',
            strokeWidth: 1,
            dashArray: [3, 3]
        };

        baseLayer.activate();
    }
}

var deviceHandles = [];
var inletHandles = [];
export function revealDeviceHandles(device) {

    hideDeviceHandles();
    device.flowOutlets.filter(outlet => {

        return outlet.direction == FlowDirection.OUT
            //&& outlet.isConnected() === false;
    }).map(outlet => {

        deviceHandles.push(new OutletHandle(outlet));
    });

    device.shaftCouplings.map(cpl => {
        deviceHandles.push(new CouplingHandle(cpl));
    });
}

export function hideDeviceHandles() {
    deviceHandles.splice(0).map(handle => handle.delete());
    currentHandle = null;
}

function revealPossibleInlets(device, oType) {

    devices.filter(dvc => dvc !== device)
        .map(dvc => {

            dvc.flowOutlets.filter(outlet => {
                return outlet.direction == FlowDirection.IN
                    && outlet.type == oType
                    && outlet.isConnected() === false;
            }).map(outlet => {
                inletHandles.push(new InletHandle(outlet));
            })
        })
}

function removeAnnotationLine() {
    if (annotationLayer.line) {
        annotationLayer.line.remove();
        annotationLayer.line = null;
    }
}

function hidePossibleInlets() {
    inletHandles.splice(0).map(handle => handle.delete());
    removeAnnotationLine();
}

function hidePossibleCouplings() {
    couplingsHandles.splice(0).map(handle => handle.delete());
    removeAnnotationLine();
}

export function createShaftForDevices(dvc1, dvc2) {

    createShaft(dvc1.couplings[0], dvc2.couplings[0]);
}

export function createShaft(dp1, dp2) {

    var shaft;
    if (dp1.isConnected() && dp2.isConnected()) {

        var csh = dp2.shaft;
        shaft = dp1.shaft;

        for (var i = 0; i < csh.couplings.length; i++) {
            var cp = csh.couplings[i];
            shaft.addCoupling(cp);
        }

        csh.couplings = null;
        csh.delete();

    } else if (dp1.isConnected()) {

        shaft = dp1.shaft;
        shaft.addCoupling(dp2);

    } else if (dp2.isConnected()) {

        shaft = dp2.shaft;
        shaft.addCoupling(dp1);

    } else {

        shaft = new Shaft();
        shaft.addCoupling(dp1);
        shaft.addCoupling(dp2);
    }

    shaft.render(dp1.device);
}

var couplingsHandles = [];
function revealPossibleCouplings(device, orient) {

    devices.filter(dvc => dvc !== device)
        .map(dvc => {

            dvc.shaftCouplings.filter(cpl => {

                return cpl.orientation == orient
                    && isShaftConnectedToPoint(device, cpl) == false;

            }).map(cpl => {

                let shaftShape = new ShaftShape(cpl);
                shaftShape.on('mouseup', function () {
                    createShaft(currentHandle.coupling, this.coupling);
                    hidePossibleInlets();
                });

                couplingsHandles.push(shaftShape);
            });
        });
}

function isShaftConnectedToPoint(dvc, c_cpl) {

    var c_shafts = shafts.filter(sh => {
        return sh.couplings.indexOf(c_cpl) > -1;
    });
    
    for (var i = 0; i < dvc.shaftCouplings.length; i++) {

        var d_cpl = dvc.shaftCouplings[i];
        for (var j = 0; j < c_shafts.length; j++) {
            var sh = c_shafts[j];
            if (sh.couplings.indexOf(d_cpl) > -1) {
                return true;
            }
        }
    }

    return false;
}

export function clear(){
    
    let _shafts = shafts.splice(0);
    let _flows = flows.splice(0);
    let _devices = devices.splice(0);

    _shafts.map(shaft => shaft.delete() );
    _flows.map(flow => flow.remove() );
    _devices.map(dvc => dvc.remove() );
}

export function prepareSystemModel(){

    let model = {};
    model.devices = devices.map( device => {

        let d_model = device.model;
        let props;
        for(var prop in d_model){
            let pval = d_model[prop];
            if(pval != null){
                props = props || {};
                props[prop] = pval;
            }
        }

        return {type: device.type, props};
    });

    model.flows = flows.map( flow => {

        let src_op = flow.srcOutlet;
        let dest_op = flow.destOutlet;

        let src_dvc = src_op.device
        let dest_dvc = dest_op.device;

        let src_d_index = devices.indexOf(src_dvc);
        let dest_d_index = devices.indexOf(dest_dvc);

        let src_op_index = src_dvc.flowOutlets.indexOf(src_op);
        let dest_op_index = dest_dvc.flowOutlets.indexOf(dest_op);
        let type = (src_op.type == FlowType.Stream) ? "stream" : "pipe";
        
        return {type,
                from:{ d: src_d_index , o: src_op_index  }, 
                to:  { d: dest_d_index, o: dest_op_index } };
    });

    model.shafts = shafts.map( shaft => {

        return shaft.couplings.map( cpl => {

            let dvc = cpl.device;
            let d_index = devices.indexOf(dvc);
            let c_index = dvc.shaftCouplings.indexOf(cpl); 

            return {d: d_index, c: c_index};
        });
    });
    
    return model;
}