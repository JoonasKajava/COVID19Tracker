import React from "react";


export class Statistics extends React.PureComponent {
    render() {
        return <section>
            {this.props.children}
        </section>
    }
}