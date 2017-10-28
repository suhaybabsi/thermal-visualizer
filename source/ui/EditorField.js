import React from "react";
import {FieldType} from "../Setup";
import SimpleField from "./components/SimpleField"
import UnitField from "./components/UnitField"
import UnitComboField from "./components/UnitComboField"
import UnitComboLabelField from "./components/UnitComboLabelField"
import ComboField from "./components/ComboField"

export default class EditorField extends React.Component {

  render(){

    const field = this.props.field;
    const specs = this.props.field.specs;
    const type = specs.type;

    var component = <b>NONE</b>;
    switch (type) {
    case FieldType.UNIT_COMBO:
        component = <UnitComboField field={field} onChange={this.props.onChange} />;
        break;
    case FieldType.UNIT_COMBO_LABEL:
        component = <UnitComboLabelField field={field} onChange={this.props.onChange} />;
        break;
    case FieldType.COMBO:
        component = <ComboField field={field} onChange={this.props.onChange} />;
        break;
    case FieldType.UNIT:
        component = <UnitField field={field} onChange={this.props.onChange} />;
        break;
    case FieldType.SIMPLE:
        component = <SimpleField field={field} onChange={this.props.onChange} />;
        break;
    }

    return (
      <div>
        <h5>{specs.title}</h5>
        {component}
      </div>
    );
  }
}