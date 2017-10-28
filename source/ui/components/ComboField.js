import React from "react";
import ListItem from "./ListItem";
import UIField from "./UIField";

export default class ComboField extends UIField {

  updateState(field) {
    let value = field.value;
    let specs = field.specs;
    let list = field.specs.options;
    
    let selItem = list.filter(item => {
      return item.value === value; 
    })[0] || {name: "None"};
    
    this.setState({
      selectedItem: selItem
    });
  }

  itemSelected(item) {
    this.setState({ selectedItem: item });
  }

  render() {

    let list = this.props.field.specs.options;
    let listElms = list.map((item, i) => {
      return <ListItem key={i} text={item.name} 
                       target={item} 
                       itemSelected={this.itemSelected.bind(this)} />
    });

    return (
      <div class="dropdown">
        <button class="btn btn-default dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true" ><label>{this.state.selectedItem.name}</label> <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">{listElms}</ul>
      </div>
    );
  }
}