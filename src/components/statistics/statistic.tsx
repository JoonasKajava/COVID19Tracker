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
                {this.props.data.properties!['country']}
            </div>
            <div>
                {this.state.previousData.properties![this.props.dataPoint.name]}
            </div>
            <div>
                {this.props.data.properties![this.props.dataPoint.name]}
            </div>
        </div>
    }
}