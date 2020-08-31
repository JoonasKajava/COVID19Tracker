import React from "react";
import { IInfoBoxProps } from "../../react-app-env";


export class InfoBox extends React.PureComponent<IInfoBoxProps, any> {
    render() {
        return <div className="absolute bg-primary0 z-10 bg-opacity-50 m-4 py-2 px-4 text-white">
            <div style={{gridTemplateColumns: "auto auto"}} className="grid gap-y-2 gap-x-4 text-xs">
                <div>Lati.</div><div>{this.props.latitude.toFixed(4)}</div>
                <div>Long.</div><div>{this.props.longitude.toFixed(4)}</div>
                <div>Zoom</div><div>{this.props.zoom.toFixed(2)}</div>
                {this.props.geocode && 
                <>
                <div>Addr.</div><div>{this.props.geocode.features.filter((feature) => feature.place_type[0] === "address")[0]?.place_name}</div>
                </>}
            </div>
        </div>
    }
}