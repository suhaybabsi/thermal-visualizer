import dispatcher from "./Dispatcher";

export function modelCalculated() {
    dispatcher.dispatch({
        type: "MODEL_CALCULATED"
    });
}