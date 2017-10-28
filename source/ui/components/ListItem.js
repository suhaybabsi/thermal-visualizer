import React from "react";

export default class ListItem extends React.Component {

  itemSelected() {
    const target = this.props.target;
    this.props.itemSelected(target);
  }
  render() {
    const text = this.props.text;
    return (<li><a onClick={this.itemSelected.bind(this)} href="#">{text}</a></li>);
  }
}