import dispatcher from "./Dispatcher";

export function modelCalculated() {
    dispatcher.dispatch({
        type: "MODEL_CALCULATED"
    });
}

export function showSystemResults() {
    dispatcher.dispatch({
        type: "OPEN_RESULTS"
    });
}

export function showEditorForDevice(device) {
    dispatcher.dispatch({
        type: "OPEN_EDITOR",
        payload: { device }
    });
}