import React from "react";
import { IStatisticsProps } from "../../react-app-env";
import { Statistic } from "./statistic";


export class Statistics extends React.PureComponent<IStatisticsProps> {
    render() {
        return <section>
            {this.props.data.features.map((stat, index) => {
                <Statistic data={stat} dataPoint={this.props.dataPoint} />
            })}
        </section>
    }
}