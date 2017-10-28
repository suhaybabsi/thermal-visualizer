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

function calculateModel(){

    let model = diagram.prepareSystemModel();
    console.log(model);
    
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

    }).fail(function (res, st, err) {

        console.log(res, st, err)
    });
}