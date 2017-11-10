import * as diagram from "./Diagram";
import "./Interface";
import buildConfiguration from "./Configurations";

import Chart from 'chart.js';
import "./ui/Forms";
import "./ui/SettingsForm";

import Device from "./Device";
import { Flow } from "./Flow";
import { Shaft } from "./Shaft";
import { Point } from "chart.js/src/elements";

diagram.setup();
diagram.on("ready", function () {

    console.log("Hello there, Visualizer is ready :)");
    buildConfiguration(3);
});

$(".modal-body .list-group .list-group-item").click(function () {

    let conf = Number($(this).attr("conf"));

    diagram.clear();
    buildConfiguration(conf);
});