import React from "react";
import UIField from "./UIField";

export default class SimpleField extends UIField {

  updateState(field) {
    let { value, result } = field;
    let checked = (value !== null);
    value = value || 0

    this.setState({
      checked: checked,
      value: result || value
    });
  }

  checkboxChanged(e) {

    let checked = $(e.target).prop("checked")
    let { specs } = this.props.field;
    let { value } = this.state;

    if(checked) {
      this.props.onChange(specs.prop, Number(value) );
    } else {
      this.props.onChange(specs.prop, null);
    }

    this.setState({ checked });
  }

  textInputChanged(e) {
    var nvalue = $(e.target).val();
    var specs = this.props.field.specs;

    this.setState({ value: nvalue });
    this.props.onChange(specs.prop, Number(nvalue));
  }

  render() {
    return (
      <div class="input-group input-group-sm">
        <span class="input-group-addon">
          <input type="checkbox" checked={this.state.checked} onChange={this.checkboxChanged.bind(this)} aria-label="..." />
        </span>
        <input type="text" value={this.state.value} onChange={this.textInputChanged.bind(this)} class="form-control" disabled={!this.state.checked} />
      </div>
    );
  }
}