import React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import dispatcher from "../Dispatcher";

export default class FlowEditor extends React.Component {

    componentWillMount() {
        this.regId = dispatcher.register( this.handleActions.bind(this) );
        this.setState({flow: this.props.flow})
    }

    handleActions(action){}
    componentWillUnmount(){
        dispatcher.unregister(this.regId);
    }

    closeEditor() {
        const editorElm = document.getElementById("editor-layer");
        ReactDOM.unmountComponentAtNode(editorElm);
    }

    render() {

        let number = (this.state.flow.number > 0) 
            ? "(" + this.state.flow.number + ")" : "";
            
        return (
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}>
                <div id="flow-editor">
                    <div class="editor-header">
                        Edit Flow {number}
                        <button class="close-btn btn btn-link" onClick={this.closeEditor.bind(this)}>
                            <span class="fa fa-chevron-down"></span>
                        </button>
                    </div>
                    <div class="editor-content">
                        
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}