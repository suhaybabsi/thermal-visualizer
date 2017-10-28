import React from "react";

export default class UIField extends React.Component {

    componentWillReceiveProps(newProps) {
        this.updateState(newProps.field);
    }
    componentWillMount() {
        this.updateState(this.props.field);
    }

    updateState(field) { }
}