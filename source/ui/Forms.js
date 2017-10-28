import React from "react";
import ReactDOM from "react-dom";
import dispatcher from "../Dispatcher";
import ResultsPanel from "./ResultsPanel";

const resultsElm = document.getElementById("results-layer");

dispatcher.register(handleActions);
function handleActions(action){

    switch(action.type){
        case "OPEN_RESULTS":
        ReactDOM.render(<ResultsPanel />, resultsElm);
        break;
    }
}