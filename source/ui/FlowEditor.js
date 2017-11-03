import React from "react";
import ReactDOM from "react-dom";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import dispatcher from "../Dispatcher";

export default class FlowEditor extends React.Component {


    componentWillMount() {
        this.setState({ flow: this.props.flow })
    }

    componentWillUnmount() {
        this.state.flow.unselect();
    }

    closeEditor() {
        const editorElm = document.getElementById("editor-layer");
        ReactDOM.unmountComponentAtNode(editorElm);
    }

    fieldChangeHandler(field) {
        this.state.flow.refreshNodes();
    }

    pathButtonClicked(e) {

        let node = ReactDOM.findDOMNode(this);
        let index = $(".btn-group .btn", node).index(e.target);

        this.state.flow.setPathIndex(index);
        this.forceUpdate();
    }

    render() {

        let fields = this.state.flow.node.label.fields;
        let elements = [
            { name: "Temperature", ref: fields.t },
            { name: "Pressure", ref: fields.p },
            { name: "Mass Rate", ref: fields.m },
            { name: "Specific Energy", ref: fields.h },
            { name: "Specific Entropy", ref: fields.s },
            { name: "Specific Exergy", ref: fields.x },
        ]

        let elmsList = elements.map((element, i) => {
            return <FlowField key={i}
                element={element}
                onChange={this.fieldChangeHandler.bind(this)} />
        });

        let node2Label, elmsList2, newLine, startLabel;
        if (this.state.flow.node2) {
            let fields2 = this.state.flow.node.label.fields;
            let elements2 = [
                { name: "Temperature", ref: fields2.t },
                { name: "Pressure", ref: fields2.p },
                { name: "Mass Rate", ref: fields2.m },
                { name: "Specific Energy", ref: fields2.h },
                { name: "Specific Entropy", ref: fields2.s },
                { name: "Specific Exergy", ref: fields2.x },
            ]

            elmsList2 = elements2.map((element, i) => {
                return <FlowField key={i}
                    element={element}
                    onChange={this.fieldChangeHandler.bind(this)} />
            });

            startLabel = "Start - ";
            node2Label = <label>End - Properties</label>;
            newLine = <br/>
        }

        let number = (this.state.flow.number > 0)
            ? "(" + this.state.flow.number + ")" : "";

        let pathButtonsClasses = [
            "btn btn-default",
            "btn btn-default",
            "btn btn-default",
            "btn btn-default"
        ];

        pathButtonsClasses[this.state.flow.pathIndex] += " active";
        let noEventsCss = { pointerEvents: "none" };

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
                        <div class="btn-group" role="group">
                            <button type="button" class={pathButtonsClasses[0]} onClick={this.pathButtonClicked.bind(this)} ><img style={noEventsCss} src="img/fl_flat_start.png" /></button>
                            <button type="button" class={pathButtonsClasses[1]} onClick={this.pathButtonClicked.bind(this)} ><img style={noEventsCss} src="img/fl_flat_end.png" /></button>
                            <button type="button" class={pathButtonsClasses[2]} onClick={this.pathButtonClicked.bind(this)} ><img style={noEventsCss} src="img/fl_vertical.png" /></button>
                            <button type="button" class={pathButtonsClasses[3]} onClick={this.pathButtonClicked.bind(this)} ><img style={noEventsCss} src="img/fl_horizontal.png" /></button>
                        </div><br /><br />
                        <label>{startLabel}Properties</label><br />
                        {elmsList}
                        {newLine}
                        {node2Label}
                        {newLine}
                        {elmsList2}
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

class FlowField extends React.Component {

    componentWillMount() {

        this.setState({ element: this.props.element });
    }

    checkboxChanged() {

        let val = this.state.element.ref.visible;
        this.state.element.ref.visible = !val;

        this.props.onChange(this.state.element);
        this.forceUpdate();
    }

    render() {

        return (
            <div class="checkbox">
                <label>
                    <input type="checkbox"
                        checked={this.state.element.ref.visible}
                        onChange={this.checkboxChanged.bind(this)} />
                    {this.state.element.name}
                </label>
            </div>
        );
    }
}