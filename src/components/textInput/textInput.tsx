import React from "react";
import { ITextInputProps, ITextInputState } from "../../react-app-env";

export class TextInput extends React.PureComponent<ITextInputProps, ITextInputState> {
    constructor(props: ITextInputProps) {
        super(props);
        this.state = {
            value: "",
            selectedIndex: 0,
            autoComplete: []
        }
    }


    onChange(value: string) {
        this.setState({
            value: value,
            selectedIndex: 0,
            autoComplete: value !== "" ? this.props.autoCompleteValues?.filter((f) => {
                return f.toLocaleLowerCase().includes(value.toLocaleLowerCase());
            }).splice(0, 10) : []
        })
        if (this.props.onChange) this.props.onChange(value);
    }

    onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!this.state.autoComplete) return;
        let current = this.state.selectedIndex;
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                current--;
                break;
            case 'ArrowDown':
                event.preventDefault();
                current++;
                break;
            case 'Enter':
                if(this.state.autoComplete.length > 0) this.onChange(this.state.autoComplete[current]);
                if(this.props.onComplete && this.state.autoComplete && this.state.autoComplete.length > 0) {
                    this.props.onComplete(this.state.autoComplete[current]);
                }
                break;
        }
        if (current < 0) {
            current = this.state.autoComplete.length - 1;
        } else
            if (current > this.state.autoComplete.length - 1) {
                current = 0;
            }
        this.setState({
            selectedIndex: current
        });
    }

    onMouseClick(value: string) {
        this.onChange(value);
        if(this.props.onComplete && this.state.autoComplete && this.state.autoComplete.length > 0) {
            this.props.onComplete(value);
        }
    }

    onMouseOver(index: number) {
        this.setState({
            selectedIndex: index
        });
    }

    render() {
        return <div className={"border-solid border-2 border-primary1 inline-flex items-center bg-white relative text-input-wrapper " + (this.props.className || "")}>
            <input type="text" onKeyDown={this.onKeyDown.bind(this)} className="py-2 px-4 flex-1" value={this.state.value} onChange={(event) => this.onChange(event.target.value)} />
            {this.props.icon && <span className="material-icons">{this.props.icon}</span>}
            {this.state.autoComplete && this.state.value.length > 0 &&
                <ul className="absolute w-full list-none z-10 top-100 bg-primary1 border-solid border-2 border-primary1 hidden">
                    {this.state.autoComplete.map((value, index) => {
                        return <li tabIndex={0} key={value} onMouseOver={this.onMouseOver.bind(this, index)} onClick={this.onMouseClick.bind(this, value)} className={"flex justify-between items-center px-4 py-2 hover:bg-primary2 text-white cursor-pointer " + (this.state.selectedIndex === index ? "bg-primary2" : "")}>{value} <span className="material-icons">arrow_forward</span></li>
                    })}
                </ul>
            }
        </div>
    }
}