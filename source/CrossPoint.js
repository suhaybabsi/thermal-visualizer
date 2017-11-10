import Device from "./Device";
import * as builders from "./Builders";
import { OutletConfig } from "./Setup";
import { FlowDirection, FlowType } from "./Flow";

export default class CrossPoint extends Device {

    constructor(flowType) {

        let n = 0;
        let w = 7, w2 = w * 2;
        let color = (flowType == FlowType.Stream)
            ? new Color(.9, .3, .1, .8)
            : new Color(.1, .3, .9, .8);

        super("extraction", {}, {
            name: "Cross Point",
            abbrev: null,
            build: builders.outlineCircle(color, 3, w),
            fields: [],
            outlets: [
                new OutletConfig(flowType, FlowDirection.IN, -n, w),
                new OutletConfig(flowType, FlowDirection.OUT, w, -n),
                new OutletConfig(flowType, FlowDirection.OUT, w2 + n, w)
            ]
        });
    }

    mouseEnterHandler(){}
}