import React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import RC2 from "react-chartjs2";
import * as diagram from "../Diagram";
import { units } from "../Setup";
import ComboBox from "./components/ComboBox";

let chartItems = [
    {name: "Temperature", prop: "t", unit: units.t[0]},
    {name: "Pressure", prop: "p", unit: units.p[0]},
    {name: "Mass Flow Rate", prop: "m", unit: units.m[0]},
    {name: "Specific Enthalpy", prop: "h", unit: units.x[0]},
    {name: "Specific Entropy", prop: "s", unit: units.x[0]},
    {name: "Specific Exergy", prop: "x", unit: units.x[0]}
];

let chartUnit;
let chartOptions = {
    legend: { display: false },
    title: { display: true, text: 'Temperature', position: "left"},
    scales: {
        xAxes: [{
            type: 'linear',
            position: 'bottom',
            ticks: {
                stepSize: 1,
                callback: function(value, index, values) {
                    return '' + value;
                }
            }
        }],
        yAxes: [{
            type: 'linear',
            ticks: {
                callback: function(value, index, values) {
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
        borderColor: 'rgb(255, 99, 132)',
        data: [],
    }]
};

export default class ResultsPanel extends React.Component {
    
    componentWillMount(){

        let item = chartItems[0];
        this.prepareData(item);
        this.setState({chartItem: item});
    }

    prepareData(item){

        chartUnit = item.unit;
        chartOptions.title.text = item.name + " [" + item.unit.label+"]";

        var dataList = [];
        diagram.flows.map( (flow, i) => {

            let res = flow.results;
            if( res && res[item.prop] ){
                dataList.push({x: i+1, y: res[item.prop]});
            }
        });

        chartData.datasets[0].data = dataList;
    }

    closePanel() {
        let node = ReactDOM.findDOMNode(this);
        let elm = $(node).parent()[0];
        ReactDOM.unmountComponentAtNode(elm);
    }

    chartItemChanged(item) {

        this.prepareData(item);
        this.setState({chartItem: item});
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
                    <ComboBox value={this.state.chartItem} items={chartItems} onChange={this.chartItemChanged.bind(this)} />
                    <br/>
                    <RC2 data={chartData} options={chartOptions} type='line' />
                </div>
                <div class="panel-footer" />
            </div>
        );
    }
}

