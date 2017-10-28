import React from "react";
import ListItem from "./ListItem";
import UIField from "./UIField";

export default class UnitComboLabelField extends UIField {

  updateState(field) {

    let unit = field.specs.options[0];
    let result = field.result || 0;
    result = unit.print(result);

    this.setState({
      unit: unit,
      value: result
    });
  }

  optionSelected(unit) {
    let org_val = this.props.field.value;
    org_val = org_val || this.props.field.result;
    
    this.setState({
      unit: unit,
      value: unit.print(org_val)
    });
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
        <input type="text" class="form-control" value={this.state.value} disabled/>
        <div class="input-group-btn">
          <button type="button"
            class="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"><label>{this.state.unit.label}</label> <span class="caret"></span></button>
          <ul class="dropdown-menu dropdown-menu-right">{list}</ul>
        </div>
      </div>
    );
  }
}