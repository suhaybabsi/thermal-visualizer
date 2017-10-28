import React from "react";
import ListItem from "./ListItem";
import UIField from "./UIField";

export default class UnitComboField extends UIField {

  updateState(field) {

    let unit = field.specs.options[0];
    let result = field.result;
    result = (result) ? unit.print(result) : null;

    let checked = field.value !== null;
    let value = field.value || 0
    value = unit.print(value);

    this.setState({
      unit: unit,
      value: result || value,
      checked: checked
    });
  }

  optionSelected(option) {

    let org_val = this.props.field.value;
    org_val = org_val || this.props.field.result;

    this.setState({
      unit: option,
      value: option.print(org_val)
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
    var new_value = $(e.target).val();
    var unit = this.state.unit;
    var specs = this.props.field.specs;
    var nvalue = unit.edit(Number(new_value));

    this.setState({ value: new_value });
    this.props.field.value = nvalue;
    this.props.onChange(specs.prop, nvalue);
  }

  render() {

    const specs = this.props.field.specs;
    let list = specs.options.map((option, i) => {
      return <ListItem
        key={i}
        itemSelected={this.optionSelected.bind(this)}
        target={option}
        text={option.label} />;
    });

    return (
      <div class="input-group input-group-sm">
        <span class="input-group-addon">
          <input type="checkbox" checked={this.state.checked} onChange={this.checkboxChanged.bind(this)} aria-label="..." />
        </span>
        <input type="text"
          class="form-control"
          value={this.state.value}
          onChange={this.textInputChanged.bind(this)}
          disabled={!this.state.checked} />
        <div class="input-group-btn">
          <button type="button"
            class="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"><label>{this.state.unit.label}</label> <span class="caret"></span></button>
          <ul class="dropdown-menu dropdown-menu-right">
            {list}
          </ul>
        </div>
      </div>
    );
  }
}