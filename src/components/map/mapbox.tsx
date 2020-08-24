import React from "react";
import mapboxgl from 'mapbox-gl';
import { settings } from "../../settings";
import { IMapProps, IMapState } from "../../react-app-env";
import { Button } from "../button/button";

export class MapBox extends React.PureComponent<IMapProps, IMapState> {
    container: any = null;

    componentDidMount() {
        mapboxgl.accessToken = settings.mapbox;
        const map = new mapboxgl.Map({
            container: this.container,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.props.longitude, this.props.latitude],
            zoom: this.props.zoom
        });
        map.on('move', () => {
            let center = map.getCenter();
            this.setState({
                longitude: center.lng,
                latitude: center.lat,
                zoom: map.getZoom()
            });
        });
    }

    render() {
        return <div>
            <div>
                <h3>Map controls</h3>
                <div className="py-2">
                    <Button>Center</Button>
                </div>
            </div>
            <div className="w-full" style={{height: '50vh'}} ref={el => this.container = el}></div>
        </div>
    }
}