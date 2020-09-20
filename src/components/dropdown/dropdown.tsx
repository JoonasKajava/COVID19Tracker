import React, { createRef } from "react";
import { IDropdownProps, IDropdownState } from "../../react-app-env";


export class Dropdown extends React.PureComponent<IDropdownProps, IDropdownState> {
    itemListRef = createRef<HTMLUListElement>();
    dropdownRef = createRef<HTMLDivElement>();
    constructor(props: IDropdownProps) {
        super(props);
        this.state = {
            selected: props.defaultSelection
        };
    }

    onChange(key: string) {
        this.setState({
            selected: key
        }, () => this.props.onChange(key));
    }
    componentDidMount() {
        this.resize();
        if(this.props.autoWidth) {
            window.addEventListener("resize", this.resize.bind(this));
        }
    }

    resize() {
        if (this.dropdownRef.current && this.itemListRef.current && (this.props.autoWidth)) {
            this.itemListRef.current.style.display = 'block';
            this.dropdownRef.current.style.width = this.itemListRef.current?.scrollWidth + "px";
            this.itemListRef.current.style.display = "";
        }
    }

    render() {
        return <div ref={this.dropdownRef} className={"dropdown " + this.props.className}>
            <div className="handle w-full justify-between">{this.props.title || this.props.items[this.state.selected].name}{this.props.icon && <span className="material-icons">{this.props.icon}</span>}</div>
            <ul ref={this.itemListRef} className="item-list list-none">
                {Object.keys(this.props.items).map((key) => {
                    return <li key={key} onClick={this.onChange.bind(this, key)} className={(this.state.selected === key ? "active" : "") + " flex justify-between"}>{this.props.items[key].name}{this.props.items[key].icon && <span className="material-icons">{this.props.items[key].icon}</span>}</li>
                })}
            </ul>
        </div>
    }
}