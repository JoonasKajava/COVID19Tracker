import React from "react";
import { COVID, IStatisticProps, IStatisticState } from "../../react-app-env";


export class Statistic extends React.PureComponent<IStatisticProps, IStatisticState> {
    shouldComponentUpdate(nextProps: IStatisticProps, nextState: any) {
        this.setState({
            previousData: this.props.data
        });
        return true;
    }

    render() {
        return <div>
            <div>
                {this.props.data.Country}
            </div>
            <div>
                {(this.state.previousData as any)[this.props.dataPoint.name]}
            </div>
            <div>
                {(this.props.data as any)[this.props.dataPoint.name]}
            </div>
        </div>
    }
}