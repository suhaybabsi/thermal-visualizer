import React from "react";
import ListItem from "./ListItem";

export default class ComboBox extends React.Component {
    componentWillMount() {
        this.setState({ selectedItem: this.props.value });
    }
    
    itemSelected(item) {
        this.setState({ selectedItem: item });
        this.props.onChange(item);
    }

    render() {

        let list = this.props.items;
        let listElms = list.map((item, i) => {
            return <ListItem key={i} text={item.name}
                target={item}
                itemSelected={this.itemSelected.bind(this)} />
        });

        let _class = "btn btn-default dropdown-toggle"
        _class = this.props.isSmall ? _class + " btn-xs" : _class;

        return (
            <div class="dropdown">
                <button class={ _class }
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