import React from "react";
import { ITimeSelectorProps } from "../../react-app-env";


export class TimeSelector extends React.PureComponent<ITimeSelectorProps, any> {
    render() {
        const progress = 100-(this.props.currentTime.getTime() - this.props.startDate.getTime())/(this.props.endDate.getTime() - this.props.startDate.getTime())*100;
        return <div className="my-4 mx-auto py-2">
            <h2 className="text-center">{this.props.currentTime.toDateString()}</h2>
            <div className="bg-primary2 relative h-4">
                <div style={{right: progress.toFixed(1)+"%"}} className="absolute left-0 top-0 bottom-0 bg-primary0 transition-all duration-200"></div>
            </div>
        </div>
    }
}