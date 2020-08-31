import React, { Children } from "react";
import { IStatusBox } from "../../react-app-env";


export class StatusBox extends React.PureComponent<IStatusBox, any> {
    render() {
        return <div className={"bg-opacity-50 py-2 px-4 text-white " + this.props.className}>
            {this.props.children}
        </div>
    }
}