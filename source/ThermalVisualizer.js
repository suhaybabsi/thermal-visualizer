import * as diagram from "./Diagram";
import "./Interface";

import Device from "./Device";
import {Flow} from "./Flow";
import {Shaft} from "./Shaft";
import Chart from 'chart.js';
import "./ui/Forms";

diagram.setup();
diagram.on("ready", function () {

    console.log("Hello there, Visualizer is ready :)")

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
});


/*
let ctx = document.getElementById("chart");
let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});*/