import React from "react";
import ReactDOM from "react-dom";
import dispatcher from "../Dispatcher";
import ResultsPanel from "./ResultsPanel";
import DeviceEditor from "./DeviceEditor";

const resultsElm = document.getElementById("results-layer");
const editorElm = document.getElementById("editor-layer");

dispatcher.register(handleActions);

function launchEditorForDevice(device) {

    ReactDOM.unmountComponentAtNode(editorElm);
    ReactDOM.render(<DeviceEditor device={device} />, editorElm);
    woopra.track("device_edited", { type: device.type });
}

function handleActions(action) {

    switch (action.type) {
        case "OPEN_RESULTS":
            ReactDOM.render(<ResultsPanel />, resultsElm);
            break;
        case "OPEN_EDITOR":
            launchEditorForDevice(action.payload.device);
            break;
    }
}