import React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import InputField from "./components/InputField";
import EditorField from "./EditorField";
import dispatcher from "../Dispatcher";

export default class DeviceEditor extends React.Component {

    constructor() {
        super();
        this.state = {
            name: null,
            deviceName: null
        }
    }

    componentWillMount() {
        let {device} = this.props;
        let {config, model} = device;
        
        this.setState({
            name: config.name,
            deviceName: device.name
        });

        this.regId = dispatcher.register( this.handleActions.bind(this) );
    }

    componentWillUnmount(){
        dispatcher.unregister(this.regId);
    }

    handleActions(action){

        switch(action.type){
            case "MODEL_CALCULATED":
                this.forceUpdate();
                break;
        }
    }

    devicePropertyChanged(prop, value) {
        let device = this.props.device;
        device.model[prop] = value;
    }

    nameInputChanged(value) {
        let {device} = this.props;
        device.name = value;
    }

    closeEditor() {
        const editorElm = document.getElementById("editor-layer");
        ReactDOM.unmountComponentAtNode(editorElm);
    }

    render() {

        let {config, model, results} = this.props.device;
        let list = config.fields.map((field, i) => {
            const object = {
                value: model[field.prop],
                result: (results) ? results[field.prop] : null,
                specs: field
            }
            return <EditorField key={i} field={object} onChange={this.devicePropertyChanged.bind(this)} />;
        });

        return (
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}>
                <div id="device-editor">
                    <div class="editor-header">
                        {this.state.name}
                        <button class="close-btn btn btn-link" onClick={this.closeEditor.bind(this)}>
                            <span class="fa fa-chevron-down"></span>
                        </button>
                    </div>
                    <div class="editor-content">
                        <InputField value={this.state.deviceName} onChange={this.nameInputChanged.bind(this)} />
                        {list}
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}