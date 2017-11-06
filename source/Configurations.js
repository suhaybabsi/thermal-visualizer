import Paper from "paper";
import Device from "./Device";
import CrossPoint from "./CrossPoint";
import { Flow, FlowType } from "./Flow";
import { Shaft } from "./Shaft";

function showTemperaturePressure(flows){
    flows.map(flow => { 
        flow.displayNode1Props(["p", "t"]);
        flow.displayNode2Props(["p", "t"]);
    });
}

function buildSingleShaftSimple() {

    let intake = new Device("intake");
    let compressor = new Device("compressor");
    let burner = new Device("burner");
    let turbine = new Device("gas_turbine");
    let exhaust = new Device("exhaust");
    let load = new Device("generator");

    intake.position = new Point(100, 180);
    compressor.position = new Point(250, 300);
    burner.position = new Point(420, 200);
    turbine.position = new Point(550, 300);
    exhaust.position = new Point(700, 180);
    load.position = new Point(710, 300);

    let flows = [
        new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31),
        new Flow(compressor.flowOutlets[1], burner.flowOutlets[0]).flip().displaceNode1Label(11, -30),
        new Flow(burner.flowOutlets[1], turbine.flowOutlets[0]).displaceNode1Label(8, -29),
        new Flow(turbine.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(12, -30)
    ];

    showTemperaturePressure(flows);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine.shaftCouplings[0]);
    shaft.addCoupling(load.shaftCouplings[0]);
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
    load.position = new Point(870, 210);

    let flows = [
        new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31),
        new Flow(compressor.flowOutlets[1], burner.flowOutlets[0]).flip().displaceNode1Label(11, -19),
        new Flow(burner.flowOutlets[1], turbine1.flowOutlets[0]).displaceNode1Label(8, -29),
        new Flow(turbine1.flowOutlets[1], turbine2.flowOutlets[0]).flip().flip().displaceNode1Label(15, -30),
        new Flow(turbine2.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(12, -18)
    ]

    showTemperaturePressure(flows);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine1.shaftCouplings[0]);

    let shaft2 = new Shaft();
    shaft2.addCoupling(turbine2.shaftCouplings[0]);
    shaft2.addCoupling(load.shaftCouplings[0]);
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

    let flows = [
        new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31),
        new Flow(compressor.flowOutlets[1], burner1.flowOutlets[0]).flip().displaceNode1Label(11, -19),
        new Flow(burner1.flowOutlets[1], turbine1.flowOutlets[0]).displaceNode1Label(8, -29),
        new Flow(turbine1.flowOutlets[1], burner2.flowOutlets[0]).flip().displaceNode1Label(15, 20),
        new Flow(burner2.flowOutlets[1], turbine2.flowOutlets[0]).displaceNode1Label(15, -30),
        new Flow(turbine2.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(12, -18)
    ];

    showTemperaturePressure(flows);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine1.shaftCouplings[0]);
    
    let shaft2 = new Shaft();
    shaft2.addCoupling(turbine2.shaftCouplings[0]);
    shaft2.addCoupling(load.shaftCouplings[0]);
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

    let flows = [
        new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31),
        new Flow(compressor.flowOutlets[1], regenerator.flowOutlets[0]).flip().displaceNode1Label(16, -31),
        new Flow(regenerator.flowOutlets[1], burner.flowOutlets[0]).flip().flip().displaceNode1Label(11, 30),
        new Flow(burner.flowOutlets[1], turbine.flowOutlets[0]).displaceNode1Label(25, -60),
        new Flow(turbine.flowOutlets[1], regenerator.flowOutlets[2]).flip().displaceNode1Label(15, -20),
        new Flow(regenerator.flowOutlets[3], exhaust.flowOutlets[0]).flip().flip().displaceNode1Label(15, -50)
    ];

    showTemperaturePressure(flows);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine.shaftCouplings[0]);
    shaft.addCoupling(load.shaftCouplings[0]);
}

function buildMultiShaftFlowDistributed() {

    let intake = new Device("intake");
    let compressor = new Device("compressor");
    let burner = new Device("burner");
    let turbine = new Device("gas_turbine");
    let exhaust = new Device("exhaust");

    let burner2 = new Device("burner");
    let turbine2 = new Device("gas_turbine");
    let exhaust2 = new Device("exhaust");
    let load2 = new Device("generator");
    let crossPoint = new CrossPoint(FlowType.Stream);

    intake.position = new Point(60, 120);
    compressor.position = new Point(200, 200);
    burner.position = new Point(420, 120);
    turbine.position = new Point(550, 200);
    exhaust.position = new Point(700, 75);

    burner2.position = new Point(420, 350);
    turbine2.position = new Point(550, 430);
    exhaust2.position = new Point(700, 312);
    load2.position = new Point(710, 430);
    crossPoint.position = new Point(342, 275);
    crossPoint.turn();

    let flows = [
        new Flow(intake.flowOutlets[0], compressor.flowOutlets[0]).displaceNode1Label(16, -31),
        new Flow(compressor.flowOutlets[1], crossPoint.flowOutlets[0]).displaceNode1Label(11, -40),
        new Flow(crossPoint.flowOutlets[1], burner.flowOutlets[0]).flip().flip().displaceNode1Label(26, -30),
        new Flow(burner.flowOutlets[1], turbine.flowOutlets[0]).displaceNode1Label(8, -29),
        new Flow(turbine.flowOutlets[1], exhaust.flowOutlets[0]).flip().displaceNode1Label(10, -35),
        
        new Flow(crossPoint.flowOutlets[2], burner2.flowOutlets[0]).flip().displaceNode1Label(-90, 7),
        new Flow(burner2.flowOutlets[1], turbine2.flowOutlets[0]).displaceNode1Label(8, -29),
        new Flow(turbine2.flowOutlets[1], exhaust2.flowOutlets[0]).flip().displaceNode1Label(10, -36)
    ];

    showTemperaturePressure(flows);

    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(turbine.shaftCouplings[0]);

    let shaft2 = new Shaft();
    shaft2.addCoupling(turbine2.shaftCouplings[0]);
    shaft2.addCoupling(load2.shaftCouplings[0]);
}


function buildSteamCycleSimple() {
    
    let pump = new Device("pump");
    let boiler = new Device("boiler");
    let turbine = new Device("steam_turbine");
    let condenser = new Device("condenser");
    let load = new Device("generator");
    pump.turn(2);
    boiler.turn(2);

    pump.position = new Point(370, 440);
    boiler.position = new Point(200, 275);
    turbine.position = new Point(420, 165);
    condenser.position = new Point(550, 320);
    load.position = new Point(620, 175);

    let flows = [
        new Flow(pump.flowOutlets[1], boiler.flowOutlets[0])
            .displaceNode1Label(-80, -30)
            .displaceNode2Label(-80, 20),

        new Flow(boiler.flowOutlets[1], turbine.flowOutlets[0])
            .flip()
            .displaceNode1Label(12, -30)
            .displaceNode2Label(-80, -30),

        new Flow(turbine.flowOutlets[1], condenser.flowOutlets[0])
            .flip().flip().flip()
            .displaceNode1Label(-80, 20)
            .displaceNode2Label(10, -30),

        new Flow(condenser.flowOutlets[1], pump.flowOutlets[0])
            .flip()
            .displaceNode1Label(10, 20)
            .displaceNode2Label(5, 20)
    ]

    showTemperaturePressure(flows);
    flows[0].displayNode1Props(["p", "m"]);

    let shaft = new Shaft();
    shaft.addCoupling(turbine.shaftCouplings[0]);
    shaft.addCoupling(load.shaftCouplings[0]);
}

function buildSteamCycleRegenerative2() {
    
    let pump = new Device("pump");
    let pump2 = new Device("pump");
    let boiler = new Device("boiler");
    let turbine = new Device("steam_turbine");
    let turbine2 = new Device("steam_turbine");
    let crossPoint = new CrossPoint(FlowType.Pipe);
    let cwHeater = new Device("closed_feed_heater");
    let mixChamber = new Device("mixing_chamber");
    let condenser = new Device("condenser");
    let load = new Device("generator");

    pump.turn(2);
    pump2.turn(2);
    mixChamber.turn(2);
    boiler.turn(2);

    pump.position = new Point(665, 460);
    pump2.position = new Point(380, 460);
    boiler.position = new Point(46, 235);
    turbine.position = new Point(247, 160);
    turbine2.position = new Point(543,160);
    condenser.position = new Point(765, 330);
    cwHeater.position = new Point(490, 340);
    mixChamber.position = new Point(231, 340);
    load.position = new Point(725, 170);
    crossPoint.position = new Point(415, 110);

    pump.model.ep = null;
    pump.model.mp = 10.0;

    pump2.model.ep = null;
    pump2.model.mp = 5.0;

    turbine.model.ep = 4000;
    mixChamber.model.p = 16000;
    
    new Flow(mixChamber.flowOutlets[2], boiler.flowOutlets[0])
        .displaceNode1Label(-93, -55)
        .displayNode1Props(["t", "p", "m"]);

    new Flow(boiler.flowOutlets[1], turbine.flowOutlets[0])
        .flip()
        .displaceNode2Label(-86, -32)
        .displayNode2Props(["t", "p"]);

    new Flow(turbine.flowOutlets[1], crossPoint.flowOutlets[0])
        .flip().flip();

    new Flow(crossPoint.flowOutlets[1], turbine2.flowOutlets[0])
        .flip().flip()

    new Flow(turbine2.flowOutlets[1], condenser.flowOutlets[0])
        .displaceNode1Label(-80, 20)
        .displayNode1Props(["t", "p"]);

    new Flow(condenser.flowOutlets[1], pump.flowOutlets[0])
        .flip()
        .displaceNode1Label(10, 20)
        .displayNode1Props(["m"]);
    
    new Flow(pump.flowOutlets[1], cwHeater.flowOutlets[2])
        .flip().flip()
        .displaceNode2Label(9, -32)
        .displayNode2Props(["t","p"]);
    
    new Flow(cwHeater.flowOutlets[3], mixChamber.flowOutlets[1])
        .flip().flip()
        .displaceNode2Label(6, -36)
        .displayNode2Props(["t","p"]);

    new Flow(crossPoint.flowOutlets[2], cwHeater.flowOutlets[0])
        .flip().flip().flip()
        .displaceNode2Label(-90, -56)
        .displayNode2Props(["m","t","p"]);

    new Flow(cwHeater.flowOutlets[1], pump2.flowOutlets[0])
        .flip()
        .displaceNode2Label(5, 20)
        .displayNode2Props(["t","p"]);

    new Flow(pump2.flowOutlets[1], mixChamber.flowOutlets[0])
        .flip().flip()
        .displaceNode2Label(-76, 42)
        .displayNode2Props(["t","p"]);

    let shaft = new Shaft();
    shaft.addCoupling(turbine.shaftCouplings[0]);
    shaft.addCoupling(turbine2.shaftCouplings[0]);
    shaft.addCoupling(load.shaftCouplings[0]);
}
    
function buildSteamCycleRegenerative(){
    let pump = new Device("pump");
    let pump2 = new Device("pump");
    let boiler = new Device("boiler");
    let turbine1 = new Device("steam_turbine");
    let turbine2 = new Device("steam_turbine");
    let condenser = new Device("condenser");
    let generator = new Device("generator");
    let open_feed_heater = new Device("open_feed_heater");
    let extraction = new CrossPoint(FlowType.Pipe);

    pump.turn(2)
    pump2.turn(2);
    boiler.turn(2);
    extraction.turn();

    turbine1.model.ep = null;
    pump.model.mp = null;
    pump.model.ep = 1200;
    pump2.model.ep = 16000;
    
    pump.position = new Point(665, 460);
    pump2.position = new Point(204, 460);
    boiler.position = new Point(54, 294);
    turbine1.position = new Point(247, 115);
    turbine2.position = new Point(543, 115);
    condenser.position = new Point(765, 330);
    generator.position = new Point(725, 125);
    open_feed_heater.position = new Point(420.5, 366.5);
    extraction.position = new Point(412, 248);

    new Flow(boiler.flowOutlets[1], turbine1.flowOutlets[0])
        .flip()
        .displaceNode1Label(12, -50)
        .displayNode1Props(["m", "p", "t"]);

    new Flow(turbine2.flowOutlets[1], condenser.flowOutlets[0])
        .flip().flip().flip()
        .displaceNode1Label(-85, 20)
        .displayNode1Props(["m", "p", "t"]);

    new Flow(condenser.flowOutlets[1], pump.flowOutlets[0])
        .flip()
        .displaceNode1Label(10, 20)
        .displaceNode2Label(5, 20)
        .displayNode2Props(["p", "t"]);

    new Flow(extraction.flowOutlets[1], turbine2.flowOutlets[0])
        .flip().flip();

    new Flow(turbine1.flowOutlets[1], extraction.flowOutlets[0]);
    new Flow(extraction.flowOutlets[2], open_feed_heater.flowOutlets[0])
        .flip().flip().flip()
        .displaceNode1Label(-89, 13)
        .displayNode1Props(["p", "m", "t"]);

    new Flow(pump.flowOutlets[1], open_feed_heater.flowOutlets[1])
        .flip().flip()
        .displaceNode2Label(10, -34)
        .displayNode2Props(["t", "p"]);

    new Flow(open_feed_heater.flowOutlets[2], pump2.flowOutlets[0])
        .flip().flip()
        .displaceNode2Label(5, 19)
        .displayNode2Props(["m", "p", "t"]);
        
    new Flow(pump2.flowOutlets[1], boiler.flowOutlets[0])
        .displaceNode2Label(11, 17)
        .displayNode2Props(["p"]);

    let shaft = new Shaft();
    shaft.addCoupling(turbine1.shaftCouplings[0]);
    shaft.addCoupling(turbine2.shaftCouplings[0]);
    shaft.addCoupling(generator.shaftCouplings[0]);
}

function buildSimpleTurbojet(){

    let air_flow = new Device("air_flow");
    let diffuser = new Device("diffuser");
    let compressor = new Device("compressor");
    let burner = new Device("burner");
    let gas_turbine = new Device("gas_turbine");
    let nozzle = new Device("nozzle");
    
    air_flow.position = new Point(71.5, 235.5);
    diffuser.position = new Point(232.5, 225.5);
    compressor.position = new Point(377.5, 225.5);
    burner.position = new Point(534.5, 137.5);
    gas_turbine.position = new Point(667.5, 225.5);
    nozzle.position = new Point(820.5, 227.5);
    
    let flows = [
        new Flow(air_flow.flowOutlets[0], diffuser.flowOutlets[0])
            .flip().flip()
            .displaceNode1Label(2, 34),
        new Flow(diffuser.flowOutlets[1], compressor.flowOutlets[0])
            .flip().flip()
            .displaceNode1Label(17, 58),
        new Flow(compressor.flowOutlets[1], burner.flowOutlets[0])
            .flip()
            .displaceNode1Label(10, -30),
        new Flow(burner.flowOutlets[1], gas_turbine.flowOutlets[0])
            .displaceNode1Label(16, -35),
        new Flow(gas_turbine.flowOutlets[1], nozzle.flowOutlets[0])
            .flip().flip()
            .displaceNode1Label(23, -60),
    ];

    showTemperaturePressure(flows);

    flows[0].displayNode1Props(["p", "m", "t"]);
    flows[flows.length-1].displayNode1Props(["p", "m", "t"]);
    
    let shaft = new Shaft();
    shaft.addCoupling(compressor.shaftCouplings[0]);
    shaft.addCoupling(gas_turbine.shaftCouplings[0]);
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
        case 4:
            buildMultiShaftFlowDistributed();
            break;
        case 5:
            buildSteamCycleSimple();
            break;
        case 6:
            buildSteamCycleRegenerative();
            break;
        case 7:
            buildSteamCycleRegenerative2();
            break;
        case 8:
            buildSimpleTurbojet();
            break;
    }
}

export default buildConfiguration;