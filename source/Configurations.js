import Paper from "paper";
import Device from "./Device";
import { Flow } from "./Flow";
import { Shaft } from "./Shaft";

function buildSimple() {

    let intake = new Device("intake");
    let compressor = new Device("compressor");
    let burner = new Device("burner");
    let turbine = new Device("gas_turbine");
    let exhaust = new Device("exhaust");
    let load = new Device("generator");

    intake.position = new Point(100, 120);
    compressor.position = new Point(250, 200);
    burner.position = new Point(420, 120);
    turbine.position = new Point(550, 200);
    exhaust.position = new Point(700, 120);
    load.position = new Point(710, 200);

    new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31);
    new Flow(compressor.flowOutlets[1], burner.flowOutlets[0]).flip().displaceNode1Label(11, -19);
    new Flow(burner.flowOutlets[1], turbine.flowOutlets[0]).displaceNode1Label(8, -29);
    new Flow(turbine.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(12, -18);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine.shaftCouplings[0]);
    shaft.addCoupling(load.shaftCouplings[0]);

    shaft.render(compressor);
}

function buildConfiguration(index) {

    switch (index) {
        case 0:
            buildSimple();
            break;
    }
}

export default buildConfiguration;