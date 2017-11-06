import React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import RC2 from "react-chartjs2";
import * as diagram from "../Diagram";
import { units } from "../Setup";
import { FlowType } from "../Flow";
import ComboBox from "./components/ComboBox";
import dispatcher from "../Dispatcher";

let chartItems = [
    { name: "Temperature", prop: "t", unit: units.t[0] },
    { name: "Pressure", prop: "p", unit: units.p[0] },
    { name: "Mass Flow Rate", prop: "m", unit: units.m[0] },
    { name: "Specific Enthalpy", prop: "h", unit: units.x[0] },
    { name: "Specific Entropy", prop: "s", unit: units.x[0] },
    { name: "Specific Exergy", prop: "x", unit: units.x[0] }
];

let chartUnit;
let chartOptions = {
    legend: { display: false },
    title: { display: true, text: 'Temperature', position: "left" },
    scales: {
        yAxes: [{
            type: 'linear',
            ticks: {
                callback: function (value, index, values) {
                    return (chartUnit) ? chartUnit.print(value) : value;
                }
            }
        }]
    }
};

let chartData = {
    labels: ["Stream"],
    datasets: [{
        label: "Temperature",
        lineTension: 0,
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }]
};

export default class ResultsPanel extends React.Component {

    componentWillMount() {

        let pathNames = constructPathNames(diagram.flowPaths);
        this.pathItems = diagram.flowPaths.map((path, i) => {
            return {name: pathNames[i], path};
        });

        if(this.pathItems.length == 0){
            this.pathItems.push({name: "N/A", path:[]});
        }

        let pathItem = this.pathItems[0];
        let item = chartItems[0];

        this.prepareData( pathItem.path, item);
        this.setState({ chartItem: item, pathItem });

        this.regId = dispatcher.register(this.handleActions.bind(this));
    }

    componentWillUnmount() {
        dispatcher.unregister(this.regId);
    }

    handleActions(action) {
        switch (action.type) {
            case "MODEL_CALCULATED":
                this.prepareData(this.state.chartItem);
                this.forceUpdate();
                break;
        }
    }

    prepareData(path, item) {

        chartUnit = item.unit;
        chartOptions.title.text = item.name + " [" + item.unit.label + "]";

        var labels = [];
        var dataList = [];
        path.slice().sort((a, b) => {
            return a.number > b.number;
        }).map(flow => {

            let res = flow.results;
            if (flow.getType() == FlowType.Pipe) {
                res = res.inlet;
            }

            if (res && res[item.prop]) {

                let val = Number(chartUnit.print(res[item.prop]));
                labels.push(flow.number + "");
                dataList.push(val);
            }
        });

        chartData.labels = labels;
        chartData.datasets[0].data = dataList;
    }

    closePanel() {
        let node = ReactDOM.findDOMNode(this);
        let elm = $(node).parent()[0];
        ReactDOM.unmountComponentAtNode(elm);
    }

    chartItemChanged(item) {

        let { path } = this.state.pathItem;
        this.prepareData(path, item);
        this.setState({ chartItem: item });
    }

    pathItemChanged(item){

        let { path } = item;
        this.prepareData(path, this.state.chartItem);
        this.setState({ pathItem: item })
    }

    render() {

        return (
            <div class="results-container">
                <div class="results-header">Results
                    <button class="close-btn btn btn-link" onClick={this.closePanel.bind(this)}>
                        <span class="fa fa-chevron-down"></span>
                    </button>
                </div>
                <div class="results-content">
                    <div class="chart-control">
                        <div class="f-label">Flow Path</div>
                        <ComboBox value={this.state.pathItem} items={this.pathItems} onChange={this.pathItemChanged.bind(this)} />
                        <div class="f-label">Property</div>
                        <ComboBox value={this.state.chartItem} items={chartItems} onChange={this.chartItemChanged.bind(this)} />
                    </div>
                    <br />
                    <RC2 data={chartData} options={chartOptions} type='line' />
                </div>
                <div class="panel-footer" />
            </div>
        );
    }
}

function constructPathNames(paths) {

    let names = [];
    paths.map(path => {
        
        let groups = [];
        let num_s = path[0].number;
        let num_e = path[path.length-1].number;

        var start = num_s, num = num_s;
        var last = null;
        for(var i = 1; i < path.length; i++){

            let flow = path[i];
            if(flow.number != (num + 1) ){

                groups.push([start, num])
                start = flow.number;
                num = flow.number;
            } else {

                num += 1;
            }
            
            if(i == path.length - 1 && num == flow.number){
                groups.push([start, num]);
                start = null;
            }
        }

        var name = "";
        for(var g in groups){
            let group = groups[g];
            groups[g] = group.join(" .. ");
        }

        name += groups.join(" > ");
        name += (start) ? ">" + start : "";
        
        names.push( name );
    });

    return names;
}