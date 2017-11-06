import * as diagram from "./Diagram"
import Device from "./Device";
import * as Actions from "./Actions";

$('[data-toggle="tooltip"]').tooltip({ container: 'body' });
$('[data-toggle="popover"]').popover();
$('.device-btn').click(function (e) {

    let dvcType = $(e.currentTarget).attr('device');
    let device = new Device(dvcType);
    device.position = diagram.viewCenter();
    diagram.update();

    $(this).blur();
});

$("#calculate-btn").click(function (e) {

    calculateModel();
});

$('#clear-btn').click(function (e) {

    diagram.clear();
});

$("#results-btn").click(function () {

    Actions.showSystemResults();
    woopra.track("results_shown");
});


$("#left-btn").click(function () {

    let scroll = $(".devices-btns-container").scrollLeft();

    $(".devices-btns-container").finish();
    $(".devices-btns-container").animate({
        scrollLeft: scroll - 50
    }, 200);
});


$("#right-btn").click(function () {

    let scroll = $(".devices-btns-container").scrollLeft();

    $(".devices-btns-container").finish();
    $(".devices-btns-container").animate({
        scrollLeft: scroll + 50
    }, 200);
});

$("#code-btn").click(function () {
    window.open("https://github.com/suhaybabsi/thermal-visualizer", '_blank');
});

function validateDevicesNav() {

    let width = $(".devices-btns-container").width();

    if (width < 860) {

        $("#left-btn").show();
        $("#right-btn").show();
    } else {

        $("#left-btn").hide();
        $("#right-btn").hide();
    }
}

$(document).ready(function () {

    validateDevicesNav();
});

$(window).resize(function () {

    validateDevicesNav();
});

function calculateModel() {

    $("#spinner").fadeIn()
    diagram.updateFlowPaths();

    let model = diagram.prepareSystemModel();
    console.log(model);
    console.log(JSON.stringify(model));

    let trackProps = {
        devices_count: diagram.devices.length,
        flows_count: diagram.flows.length,
        shafts_count: diagram.shafts.length
    };

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://thermal-core.herokuapp.com/calculate",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(model)
    }

    $.ajax(settings).done(function (res) {

        setTimeout(() => {
            $("#spinner").fadeOut();
        }, 1000);

        console.log(res);
        let { devices, flows, shafts } = res;

        if (devices) {
            devices.map((dvc, i) => {
                var t_dvc = diagram.devices[i];
                t_dvc.results = dvc.res;
            });
        }

        if (flows) {
            flows.map((flow, i) => {
                var t_flow = diagram.flows[i];
                t_flow.results = flow.props;
            });
        }

        if (shafts) {
            shafts.map((shaft, i) => {
                var t_shaft = diagram.shafts[i];
                t_shaft.results = shaft;
            });
        }
        
        Actions.modelCalculated();

        trackProps.success = "PASS";
        woopra.track("machine_calculated", trackProps);

    }).fail(function (res, st, err) {

        setTimeout(() => {
            $("#spinner").fadeOut();
        }, 1000);

        console.log(res, st, err);

        trackProps.success = "FAIL";
        woopra.track("machine_calculated", trackProps);
    });
}