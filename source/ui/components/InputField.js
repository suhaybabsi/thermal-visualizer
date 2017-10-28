import React from "react";

export default class InputField extends React.Component {

  componentWillReceiveProps(newProps) {
    this.setState({ value: newProps.value });
  }
  componentWillMount() {
    this.setState({ value: this.props.value });
  }

  textInputChanged(e) {
    var new_value = $(e.target).val();

    this.setState({ value: new_value });
    this.props.onChange(new_value);
  }

  render() {
    return (
      <input type="text" class="form-control"
        value={this.state.value}
        onChange={this.textInputChanged.bind(this)} />
    );
  }
}