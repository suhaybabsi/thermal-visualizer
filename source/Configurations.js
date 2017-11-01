import Paper from "paper";
import Device from "./Device";
import { Flow } from "./Flow";
import { Shaft } from "./Shaft";

function buildSingleShaftSimple() {

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

function buildMultiShaftNoReheat() {

    let intake = new Device("intake");
    let compressor = new Device("compressor");
    let burner = new Device("burner");
    let turbine1 = new Device("gas_turbine");
    let turbine2 = new Device("gas_turbine");
    let exhaust = new Device("exhaust");
    let load = new Device("generator");

    intake.position = new Point(100, 120);
    compressor.position = new Point(250, 200);
    burner.position = new Point(420, 120);
    turbine1.position = new Point(550, 200);
    turbine2.position = new Point(715, 200);
    exhaust.position = new Point(900, 120);
    load.position = new Point(870, 200);

    new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31);
    new Flow(compressor.flowOutlets[1], burner.flowOutlets[0]).flip().displaceNode1Label(11, -19);
    new Flow(burner.flowOutlets[1], turbine1.flowOutlets[0]).displaceNode1Label(8, -29);
    new Flow(turbine1.flowOutlets[1], turbine2.flowOutlets[0]).flip().flip().displaceNode1Label(15, -30);
    new Flow(turbine2.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(12, -18);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine1.shaftCouplings[0]);

    let shaft2 = new Shaft();
    shaft2.addCoupling(turbine2.shaftCouplings[0]);
    shaft2.addCoupling(load.shaftCouplings[0]);

    shaft.render(compressor);
    shaft2.render(turbine2);
}

function buildMultiShaftReheat(){

    let intake = new Device("intake");
    let compressor = new Device("compressor");
    let burner1 = new Device("burner");
    let turbine1 = new Device("gas_turbine");
    let burner2 = new Device("burner");
    let turbine2 = new Device("gas_turbine");
    let exhaust = new Device("exhaust");
    let load = new Device("generator");

    intake.position = new Point(100, 120);
    compressor.position = new Point(250, 200);
    burner1.position = new Point(420, 120);
    turbine1.position = new Point(550, 200);
    burner2.position = new Point(700, 120);
    turbine2.position = new Point(810, 200);
    exhaust.position = new Point(960, 120);
    load.position = new Point(975, 200);

    new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31);
    new Flow(compressor.flowOutlets[1], burner1.flowOutlets[0]).flip().displaceNode1Label(11, -19);
    new Flow(burner1.flowOutlets[1], turbine1.flowOutlets[0]).displaceNode1Label(8, -29);
    new Flow(turbine1.flowOutlets[1], burner2.flowOutlets[0]).flip().displaceNode1Label(15, 20);
    new Flow(burner2.flowOutlets[1], turbine2.flowOutlets[0]).displaceNode1Label(15, -30);
    new Flow(turbine2.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(12, -18);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine1.shaftCouplings[0]);
    
    let shaft2 = new Shaft();
    shaft2.addCoupling(turbine2.shaftCouplings[0]);
    shaft2.addCoupling(load.shaftCouplings[0]);

    shaft.render(compressor);
    shaft2.render(turbine2);
}

function buildSingleShaftRegeneration(){

    let intake = new Device("intake");
    let compressor = new Device("compressor");
    let burner = new Device("burner");
    let turbine = new Device("gas_turbine");
    let regenerator = new Device("heat_exchanger");
    let exhaust = new Device("exhaust");
    let load = new Device("generator");

    intake.position = new Point(30, 166);
    compressor.position = new Point(245, 260);
    burner.position = new Point(520, 164);
    turbine.position = new Point(630, 260);
    regenerator.position = new Point(375, 144);
    exhaust.position = new Point(180, 75);
    load.position = new Point(800, 265);

    exhaust.turn(2);

    new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31);
    new Flow(compressor.flowOutlets[1], regenerator.flowOutlets[0]).flip().displaceNode1Label(16, -31);
    new Flow(regenerator.flowOutlets[1], burner.flowOutlets[0]).flip().flip().displaceNode1Label(11, 30);
    new Flow(burner.flowOutlets[1], turbine.flowOutlets[0]).displaceNode1Label(25, -60);
    new Flow(turbine.flowOutlets[1], regenerator.flowOutlets[2]).flip().displaceNode1Label(15, -20);
    new Flow(regenerator.flowOutlets[3], exhaust.flowOutlets[0]).flip().flip().displaceNode1Label(15, -50);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine.shaftCouplings[0]);
    shaft.addCoupling(load.shaftCouplings[0]);
    shaft.render(compressor);
}

function buildConfiguration(index) {

    switch (index) {
        case 0:
            buildSingleShaftSimple();
            break;
        case 1:
            buildMultiShaftNoReheat()
            break;
        case 2:
            buildMultiShaftReheat();
            break;
        case 3:
            buildSingleShaftRegeneration();
            break;
    }
}

export default buildConfiguration;