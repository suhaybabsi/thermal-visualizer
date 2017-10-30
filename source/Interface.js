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
});

$("#calculate-btn").click(function(e){
    
    calculateModel();
});

$('#clear-btn').click(function(e){

    diagram.clear();
});

$("#results-btn").click(function(){

    Actions.showSystemResults();
    woopra.track("results_shown");
});

function calculateModel(){

    $("#spinner").fadeIn()

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
        let {devices, flows, shafts} = res;
        
        if(devices){
            devices.map( (dvc, i) => {
                var t_dvc = diagram.devices[i];
                t_dvc.results = dvc.res;
            });
        }

        if(flows){
            flows.map( (flow, i) => {
                var t_flow = diagram.flows[i];
                t_flow.results = flow.props;
            });
        }

        if(shafts){
            shafts.map( (shaft, i) => {
                var t_shaft = diagram.shafts[i];
                t_shaft.results = shaft;
            });
        }
        
        console.log(diagram.devices);
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