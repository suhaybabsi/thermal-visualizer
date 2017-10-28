import React from "react";
import UIField from "./UIField";

export default class UnitField extends UIField {

  updateState(field) {
    let { value, result } = field;
    let checked = (value !== null);

    let specs = field.specs;
    let unit = specs.options;

    this.setState({
      checked: checked,
      value: unit.print(result || value)
    });
  }

  checkboxChanged(e) {

    let checked = $(e.target).prop("checked");
    let { specs } = this.props.field;
    let { value } = this.state;

    if (checked) {
      this.props.onChange(specs.prop, Number(value));
    } else {
      this.props.onChange(specs.prop, null);
    }

    this.setState({ checked });
  }

  textInputChanged(e) {
    var nvalue = $(e.target).val();
    var specs = this.props.field.specs;
    var unit = specs.options;

    this.setState({ value: nvalue });
    this.props.onChange(specs.prop, unit.edit(Number(nvalue)));
  }

  render() {

    let unit = this.props.field.specs.options;

    return (
      <div class="input-group input-group-sm" >
        <span class="input-group-addon" >
          <input type="checkbox" checked={this.state.checked} onChange={this.checkboxChanged.bind(this)} aria-label="..." />
        </span>
        <input type="text" class="form-control"
          value={this.state.value}
          onChange={this.textInputChanged.bind(this)}
          disabled={!this.state.checked} />
        <span class="input-group-addon">{unit.label}</span>
      </div>
    );
  }
}