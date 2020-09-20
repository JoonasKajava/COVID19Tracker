import React, { createRef } from "react";
import { ITimeSelectorProps, ITimeSelectorState } from "../../react-app-env";
import { clamp } from "../../scripts/utilities";


export class TimeSelector extends React.PureComponent<ITimeSelectorProps, ITimeSelectorState> {

    constructor(props: ITimeSelectorProps) {
        super(props);
        this.state = {
            isDragging: false,
            sliderPosPercentage: 0
        };
    }

    slider = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener('mousemove', (ev: MouseEvent) => {
            if(!this.state.isDragging || !this.slider.current) return;
            const relative = ev.pageX - this.slider.current.offsetLeft;
            const percent = clamp((100 - relative / this.slider.current.offsetWidth * 100), 0, 100);
            this.setState({
                sliderPosPercentage: percent
            }, () => {if(this.props.onSliderDrag)this.props.onSliderDrag(this.state.sliderPosPercentage)});
        });
        document.addEventListener('mouseup', (ev: MouseEvent) => {
            if(!this.state.isDragging) return;
           this.setState({
               isDragging: false
           });
        });
    }

    componentDidUpdate() {
        const progress = 100 - (this.props.currentTime.getTime() - this.props.startDate.getTime()) / (this.props.endDate.getTime() - this.props.startDate.getTime()) * 100;
        this.setState({
            sliderPosPercentage: progress
        });
    }

    onMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.setState({
            isDragging: true
        });
    }

    render() {
        
        return <div className="my-4 mx-auto py-2">
            <h2 className="text-center">{this.props.currentTime.toDateString()}</h2>
            <div className="flex justify-between">
                <span>{this.props.startDate.toDateString()}</span>
                <span>{this.props.endDate.toDateString()}</span>
            </div>
            <div className="bg-primary2 relative h-4">
                <div style={{ right: this.state.sliderPosPercentage.toFixed(1) + "%" }} className="absolute left-0 top-0 bottom-0 bg-primary0 transition-all duration-200"></div>
            </div>
            <div ref={this.slider} className="relative mt-2">
                <div className="absolute cursor-move text-center transform translate-x-1/2 select-none" onMouseDown={this.onMouseDown.bind(this)} style={{ right: this.state.sliderPosPercentage.toFixed(1) + "%" }}>
                    <span className="material-icons">keyboard_arrow_up</span>
                    <small className="block whitespace-no-wrap">{this.props.currentTime.toDateString()}</small>
                </div>
            </div>
        </div>
    }
}