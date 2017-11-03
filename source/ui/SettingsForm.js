import React from "react";
import ReactDOM from "react-dom";
import ComboBox from "./components/ComboBox";
import { selectedUnits, update } from "../Diagram";
import { units } from "../Setup";

class SettingsForm extends React.Component {

    fieldChanged(item) {

        selectedUnits[item.prop] = item.unit;
        update();
    }

    render() {

        let list = [
            { label: "Shaft Work", prop: "w" },
            { label: "Pressure", prop: "p" },
            { label: "Temperature", prop: "t" },
            { label: "Mass Rate", prop: "m" },
            { label: "Specific Energy", prop: "h", ut: "x" },
            { label: "Specific Entropy", prop: "s", ut: "x" },
            { label: "Specific Exergy", prop: "x", ut: "x" }
        ]

        let listElms = list.map((field, i) => {

            let { prop } = field;
            let ut = (field.ut) ? field.ut : prop;

            let items = units[ut].map(unit => {
                return { name: unit.name, unit, prop };
            });

            let value = items.filter(item => {
                return selectedUnits[item.prop] === item.unit;
            })[0];

            return (
                <div key={ i } class="setting-field">
                    <div>{field.label}</div>
                    <ComboBox isSmall={true} items={items} value={value} onChange={this.fieldChanged.bind(this)} />
                </div>
            );
        });

        return (
            <div>
                { listElms }
            </div>
        );
    }
}

$('#settings-dialog').on('shown.bs.modal', function (e) {

    let body = $(".modal-body", this)[0];
    ReactDOM.render(<SettingsForm />, body);
});

$('#settings-dialog').on('hidden.bs.modal', function (e) {

    let body = $(".modal-body", this)[0];
    ReactDOM.unmountComponentAtNode(body);
});

