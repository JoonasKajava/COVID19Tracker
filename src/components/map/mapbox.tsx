import React from "react";
import mapboxgl from 'mapbox-gl';
import { settings } from "../../settings";
import { IMapProps, IMapState, IDropdownItem } from "../../react-app-env";
import { Button } from "../button/button";
import { InfoBox } from "./infobox";
import { reverseGeocodingFromCoords } from "../../scripts/geolocation";
import { Dropdown } from "../dropdown/dropdown";

export class MapBox extends React.PureComponent<IMapProps, IMapState> {
    container: any = null;
    map: mapboxgl.Map | null = null;
    stylePrefix = "mapbox://styles/mapbox/";
    styles : {[key: string] : IDropdownItem;} = {
        'streets-v11': {name: 'Streets', icon: ''},
        'outdoors-v11': {name: 'Outdoors', icon: ''},
        'satellite-streets-v11': {name: 'Satellite', icon: ''}
    };

    geocodeUpdateFrequency = 2000;

    constructor(props: IMapProps) {
        super(props);
        this.state = {
            latitude: props.latitude,
            longitude: props.longitude,
            zoom: props.zoom,
            style: 'streets-v11',
            shouldReGeocode: true,
            geocode: null
        }
        
    }

    componentDidMount() {
        mapboxgl.accessToken = settings.mapbox;
        this.map = new mapboxgl.Map({
            container: this.container,
            style: this.stylePrefix + this.state.style,
            center: [this.props.longitude, this.props.latitude],
            zoom: this.props.zoom
        });

        const markerIcon = document.createElement('span');
        markerIcon.className = 'material-icons';
        markerIcon.innerText = 'home';
        const marker = new mapboxgl.Marker({
            element: markerIcon
        }).setLngLat([this.props.longitude, this.props.latitude]).addTo(this.map);



        this.map.on('move', () => {
            let center = this.map?.getCenter() || { lng: this.props.longitude, lat: this.props.latitude };
            this.setState({
                longitude: center.lng,
                latitude: center.lat,
                zoom: this.map?.getZoom() || this.props.zoom,
                shouldReGeocode: true
            });
        });
        setInterval(() => {
            if(!this.state.shouldReGeocode) return;
            reverseGeocodingFromCoords(this.state.latitude, this.state.longitude).then((response) => {
                this.setState({
                    geocode: response,
                    shouldReGeocode: false
                });
            });
        }, this.geocodeUpdateFrequency);
    }

    centerMap() {
        this.map?.setCenter([this.props.longitude, this.props.latitude]);
    }
    setStyle(key: string) {
        this.map?.setStyle(this.stylePrefix + key);
    }

    render() {
        return <div>
            <div>
                <h3>Map controls</h3>
                <div className="py-2">
                    <Button icon="my_location" onClick={this.centerMap.bind(this)} className="mx-2 first:ml-0">Home</Button>
                    <Dropdown
                    title="Style"
                    icon="map"
                    defaultSelection={this.state.style}
                    items={this.styles}
                    onChange={this.setStyle.bind(this)}
                    />
                </div>
            </div>
            <div>
                <InfoBox
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    zoom={this.state.zoom}
                    geocode={this.state.geocode}
                 />
                <div className="w-full" style={{ height: '50vh' }} ref={el => this.container = el}></div>
            </div>
        </div>
    }
}