import React from "react";
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { settings } from "../../settings";
import { IMapProps, IMapState, IDropdownItem, ISimpleDate, GeoJSONWrapper } from "../../react-app-env";
import { Button } from "../button/button";
import { reverseGeocodingFromCoords } from "../../scripts/geolocation";
import { Dropdown } from "../dropdown/dropdown";
import { StatusBox } from "./statusBox";
import GeoJSON from "geojson";
import { average, mapCovidToGeoJSON, dateKey } from "../../scripts/utilities";
import { addClusterLayer, addPointLayer, addCountLayer } from "../../scripts/mapboxUtilities";

export class MapBox extends React.PureComponent<IMapProps, IMapState> {
    container: any = null;
    map: mapboxgl.Map | null = null;
    stylePrefix = "mapbox://styles/mapbox/";
    styles: { [key: string]: IDropdownItem; } = {
        'streets-v11': { name: 'Streets', icon: '' },
        'outdoors-v11': { name: 'Outdoors', icon: '' },
        'satellite-streets-v11': { name: 'Satellite', icon: '' }
    };
    dataPoints: { [key: string]: IDropdownItem } = {
        'confirmed': { name: 'Confirmed', icon: 'done' },
        'deaths': { name: 'Deaths', icon: 'sentiment_very_dissatisfied' },
        'recovered': { name: 'Recovered', icon: 'emoji_people' },
        'active': { name: 'Active', icon: 'coronavirus' }
    };
    steps: (string | number)[] = [];
    GeoJSONData: GeoJSONWrapper | null = null;
    geocodeUpdateFrequency = 2000;

    constructor(props: IMapProps) {
        super(props);
        this.state = {
            latitude: props.latitude,
            longitude: props.longitude,
            zoom: props.zoom,
            style: 'streets-v11',
            dataPoint: 'confirmed',
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
            if (!this.state.shouldReGeocode) return;
            reverseGeocodingFromCoords(this.state.latitude, this.state.longitude).then((response) => {
                this.setState({
                    geocode: response,
                    shouldReGeocode: false
                });
            });
        }, this.geocodeUpdateFrequency);

        
        let dateCounter = new Date(2020, 1,1);
        setInterval(() => {
            if(!this.GeoJSONData) return;
            if(this.GeoJSONData)(this.map?.getSource('covid') as GeoJSONSource).setData(this.GeoJSONData.data[dateKey(dateCounter)]);
            dateCounter = dateCounter.addDays(1);
        }, 1000);
    }
    componentDidUpdate() {
        if (!this.props.covidStats || this.map?.getSource('covid')) return;
        const date = new Date();
        this.GeoJSONData = mapCovidToGeoJSON(this.props.covidStats);
        console.dir(this.GeoJSONData.data[dateKey(new Date(2020, 7, 20))]);
        this.map?.addSource('covid', {
            type: 'geojson',
            cluster: true,
            data: this.GeoJSONData.data[dateKey(new Date(2020, 7, 20))],
            clusterMaxZoom: 15,
            clusterProperties: {
                'confirmed': ['+', ['get', 'confirmed']],
                'deaths': ['+', ['get', 'deaths']],
                'recovered': ['+', ['get', 'recovered']],
                'active': ['+', ['get', 'active']]
            }
        });

        this.setDataPoint(this.state.dataPoint);

    }
    centerMap() {
        this.map?.setCenter([this.props.longitude, this.props.latitude]);
    }
    setStyle(key: string) {
        this.setState({
            style: key
        }, () => this.map?.setStyle(this.stylePrefix + key));
    }
    setDataPoint(key: string) {
        this.steps = [];
        const a: number = average(this.GeoJSONData!.totals[this.state.dataPoint]) * 2;
        for (var i = 0; i < 10; i++) {
            let value = (1 / 100 * 255 * i * 10)
            this.steps.push(`rgb(${value},${255 - value},0)`);
            this.steps.push(1 / 100 * a * i * 10);
        }
        this.steps.push("red");
        this.setState({
            dataPoint: key
        }, () => {
            addClusterLayer(this.map, this.state.dataPoint, this.steps);
            addPointLayer(this.map, this.state.dataPoint, this.steps);
            addCountLayer(this.map, this.state.dataPoint, this.steps);
        });
    }

    render() {
        return <div>
            <div>
                <h3>Map controls</h3>
                <div className="py-2">
                    <Button icon="my_location" onClick={this.centerMap.bind(this)} className="mr-2">Home</Button>
                    <Dropdown
                        autoWidth={true}
                        className="mr-2"
                        title="Style"
                        icon="map"
                        defaultSelection={this.state.style}
                        items={this.styles}
                        onChange={this.setStyle.bind(this)}
                    />
                    {this.props.covidStats &&
                        <Dropdown
                            autoWidth={false}
                            className="w-40"
                            title="Data point"
                            icon="info"
                            defaultSelection={this.state.dataPoint}
                            items={this.dataPoints}
                            onChange={this.setDataPoint.bind(this)}
                        />
                    }
                </div>
            </div>
            <div>
                <div className="grid gap-4 absolute m-4 z-10">
                    <StatusBox className="bg-primary0">
                        <div style={{ gridTemplateColumns: "auto auto" }} className="grid gap-y-2 gap-x-4 text-xs">
                            <div>Lati.</div><div>{this.state.latitude.toFixed(4)}</div>
                            <div>Long.</div><div>{this.state.longitude.toFixed(4)}</div>
                            <div>Zoom</div><div>{this.state.zoom.toFixed(2)}</div>
                            {this.state.geocode &&
                                <>
                                    <div>Addr.</div><div>{this.state.geocode.features.filter((feature) => feature.place_type[0] === "address")[0]?.place_name}</div>
                                </>}
                        </div>
                    </StatusBox>
                    {this.props.loaders?.map((loader) => {
                        return <StatusBox key={loader.title} className={"flex " + loader.className}>
                            {loader.icon && <span className={"material-icons mr-4 " + loader.additionalIconClass}>{loader.icon}</span>}
                            <span>{loader.title}</span>
                        </StatusBox>
                    })}
                </div>
                <div className="w-full" style={{ height: '50vh' }} ref={el => this.container = el}></div>
            </div>
        </div>
    }
}