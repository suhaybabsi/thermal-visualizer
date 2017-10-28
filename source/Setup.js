import * as drawing from "./Drawing";
import { FlowDirection, FlowType, FlowOutlet } from "./Flow";
import { Coupling, ShaftOrientation } from "./Shaft";

function exactFunction() {
    return (vl) => vl;
}
function factorFunction(factor) {
    return (vl) => vl * factor;
}
function format(vl, p) {
    var cp = (p) ? p : 5;
    var str = isNaN(vl) ? "N/A" : Number(vl).toPrecision(cp);
    return str;
}

function formatFixed(vl, p) {
    var cp = (p) ? p : 2;
    var str = isNaN(vl) ? "N/A" : Number(vl).toFixed(cp);
    return str;
}

class Unit {

    constructor(name, label, _render, _edit) {

        this.name = name;
        if ((typeof label) === 'string') {
            this.label = label;
        } else {
            this.label = name;

            _edit = _render;
            _render = label;
        }

        if (_render) {
            this.render = ((typeof _render) === 'number')
                ? factorFunction(_render)
                : _render;
        } else {
            this.render = exactFunction();
        }

        if (_edit) {
            this.edit = ((typeof _edit) === 'number')
                ? factorFunction(_edit)
                : _edit;
        } else {
            this.edit = exactFunction();
        }
    }

    printWithLabel(vl, p) {
        var value = this.print(vl, p);
        if (value !== "N/A") {
            value += " " + this.label;
        }
        return value;
    }

    print(vl, p) {
        var avl = this.render(vl);
        return format(avl, p);
    }

    static getUnitForProperty(unit_name, prop) {

        var prop_units = units[prop];
        for (var i = 0; i < prop_units.length; i++) {
            var unit = prop_units[i];
            if (unit.name === unit_name) {
                return unit;
            }
        }
        return null;
    }
}

export let units = {
    p: [new Unit("kPa"),
    new Unit("MPa", 1 / 1000, 1000),
    new Unit("bar", 1 / 101.325, 101.325),
    new Unit("psi", 0.14503773773020923, 6.89475728)],

    t: [new Unit("K"),
    new Unit("C", "°C",
        function (vl) {
            return vl - 273.15;
        },
        function (vl) {
            return vl + 273.15;
        }),
    new Unit("F", "°F",
        function (vl) {
            return vl * 9.0 / 5.0 - 459.67;
        },
        function (vl) {
            return (vl + 459.67) * 5.0 / 9.0;
        })
    ],
    dt: [new Unit("K"),
    new Unit("C", "°C"),
    new Unit("F", "°F",
        function (vl) {
            return vl * 9.0 / 5.0;
        },
        function (vl) {
            return vl * 5.0 / 9.0;
        })
    ],
    m: [new Unit("kg/s"),
    new Unit("kg/h", 3600, 1.0 / 3600),
    new Unit("lb/s", 2.20462, 0.453592)],

    d: [new Unit("m"),
    new Unit("ft", 3.28084, 0.3048)],

    v: [new Unit("m/s"),
    new Unit("ft/s", 3.28084, 0.3048)],

    w: [new Unit("kW"),
    new Unit("MW", 1.0 / 1000, 1000),
    new Unit("hp", 1.34102, 0.745699872)],

    x: [new Unit("kJ/kg"),
    new Unit("btu/lb", 0.429923, 2.326),
    new Unit("kcal/kg", 0.239006, 4.184)]
};

export const percentUnit = new Unit("%", 100, 1 / 100);
export const emptyUnit = new Unit("", 1, 1);

/*
 * Devices Configuration
 */

export const FieldType = {
    UNIT_COMBO: 0,
    COMBO: 1,
    UNIT: 3,
    SIMPLE: 4,
    UNIT_COMBO_LABEL: 5
}

export class Field {

    constructor(prop, title, sample, type, options) {
        this.prop = prop;
        this.title = title;
        this.sample = sample;
        this.type = type;
        this.options = options;
    }
}

class OutletConfig {

    constructor(type, direction, dx, dy){
        this.type = type;
        this.direction = direction;
        this.dx = dx;
        this.dy = dy;
    }

    createOutlet(device){
        return new FlowOutlet(this.type, 
                    this.direction, device, 
                    new Point(this.dx, this.dy) );
    }
}

class CouplingConfig {

    constructor(offset, orientation){
        this.offset = offset;
        this.orientation = orientation;
    }

    createCoupling(device){
        return new Coupling(this.offset, this.orientation, device);
    }
}

export let deviceConfigurations = {
    intake: {
        name: "Gas Intake",
        abbrev: null,
        build: drawing.arrow("#2277ff", "right"),
        fields: [
            new Field("p", "Pressure", 101.325, FieldType.UNIT_COMBO, units.p),
            new Field("t", "Temperature", 288, FieldType.UNIT_COMBO, units.t),
            new Field("m", "Mass Flow Rate", 1.0, FieldType.UNIT_COMBO, units.m),
            new Field("g", "Gas Type", "air", FieldType.COMBO,[
                {name: "Air", value:"air"}, 
                {name: "Gas", value:"gas"}
            ])
        ],
        outlets: [
            new OutletConfig(FlowType.Gas, FlowDirection.OUT, 70, 20)
        ]
    },
    exhaust: {
        name: "Exhaust",
        abbrev: null,
        build: drawing.arrow("#ff3399", "right"),
        fields: [
            new Field("p", "Pressure", 102, FieldType.UNIT_COMBO, units.p),
            new Field("t", "Temperature", null, FieldType.UNIT_COMBO, units.t),
            new Field("m", "Mass Flow Rate", null, FieldType.UNIT_COMBO, units.m)
        ],
        outlets: [
            new OutletConfig(FlowType.Gas, FlowDirection.IN, 0, 20)
        ]
    },
    compressor: {
        name: "Compressor",
        abbrev: "C",
        build: drawing.rhomboid("blue"),
        fields: [
            new Field("r", "Compression Ratio", 4.0, FieldType.SIMPLE),
            new Field("wc", "Work Consumed", null, FieldType.UNIT_COMBO, units.w),
            new Field("nc", "Polytropic Efficiency", null, FieldType.UNIT, percentUnit),
            new Field("Wrev", "Reversible Work", null, FieldType.UNIT_COMBO, units.w),
            new Field("Xdest", "Exergy Destruction", null, FieldType.UNIT_COMBO, units.w),
            new Field("Xeff", "Second Law Efficiency", null, FieldType.UNIT, percentUnit)
        ],
        outlets: [
            new OutletConfig(FlowType.Gas, FlowDirection.IN, 0, 0),
            new OutletConfig(FlowType.Gas, FlowDirection.OUT, 70, 20)
        ],
        couplings: [
            new CouplingConfig(30, ShaftOrientation.Horizontal)
        ]
    },
    burner: {
        name: "Combustion Chamber",
        abbrev: "CC",
        build: drawing.circle("orange", 20),
        fields: [
            new Field("et", "Exit Temperature", 1100, FieldType.UNIT_COMBO, units.t),
            new Field("pl", "Pressure Loss", 0.03, FieldType.UNIT, percentUnit),
            new Field("nb", "Combustion Efficiency", 0.99, FieldType.UNIT, percentUnit),
            new Field("fl", "Fuel", "diesel", FieldType.COMBO, [
                {name: "Diesel", value:"diesel"}, 
                {name: "Kerosene", value:"kerosene"}
            ]),
            new Field("fa", "Fuel Air Ratio", null, FieldType.SIMPLE),
            new Field("mf", "Fuel Mass Rate", null, FieldType.UNIT_COMBO, units.m),
            new Field("Xdest", "Exergy Destruction", null, FieldType.UNIT_COMBO, units.w),
            new Field("Xeff", "Second Law Efficiency", null, FieldType.UNIT, percentUnit)
        ],
        outlets: [
            new OutletConfig(FlowType.Gas, FlowDirection.IN,  0, 20),
            new OutletConfig(FlowType.Gas, FlowDirection.OUT, 40, 20)
        ]
    },
    gas_turbine: {
        name: "Gas Turbine",
        abbrev: "GT",
        build: drawing.rhomboid("red", "right"),
        fields: [
            new Field("pr", "Pressure Ratio", null, FieldType.SIMPLE),
            new Field("wt", "Work Produced", null, FieldType.UNIT_COMBO, units.w),
            new Field("nt", "Polytropic Efficiency", null, FieldType.UNIT, percentUnit),
            new Field("Wrev", "Reversible Work", null, FieldType.UNIT_COMBO, units.w),
            new Field("Xdest", "Exergy Destruction", null, FieldType.UNIT_COMBO, units.w),
            new Field("Xeff", "Second Law Efficiency", null, FieldType.UNIT, percentUnit)
        ],
        outlets: [
            new OutletConfig(FlowType.Gas, FlowDirection.IN, 0, 20),
            new OutletConfig(FlowType.Gas, FlowDirection.OUT, 70, 0)
        ],
        couplings: [
            new CouplingConfig(30, ShaftOrientation.Horizontal)
        ]
    },
    generator: {
        name: "Load",
        abbrev: "L",
        build: drawing.circle("#33bb44", 20),
        fields: [
            new Field("w", "Work Consumed", null, FieldType.UNIT_COMBO, units.w)
        ],
        couplings: [
            new CouplingConfig(20, ShaftOrientation.Horizontal)
        ]
    },
    air_flow: {
        name: "Air Flow",
        build: drawing.arrow("red", "right"),
        fields: [
            new Field("alt", "Altitude", 0.0, FieldType.UNIT_COMBO, units.d),
            new Field("mach", "Exit Mach Number", 0.75, FieldType.SIMPLE),
            new Field("m", "Mass Flow Rate", 75.0, FieldType.UNIT_COMBO, units.m),
            new Field("v", "Velocity", null, FieldType.UNIT_COMBO_LABEL, units.v)
        ],
        outlets: [
            new OutletConfig(FlowType.Gas, FlowDirection.OUT, 70, 20)
        ]
    },
};