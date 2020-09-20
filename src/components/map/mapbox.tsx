import React from "react";
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { settings } from "../../settings";
import { IMapProps, IMapState, IDropdownItem, GeoJSONWrapper } from "../../react-app-env";
import { Button } from "../button/button";
import { reverseGeocodingFromCoords } from "../../scripts/geolocation";
import { Dropdown } from "../dropdown/dropdown";
import { StatusBox } from "./statusBox";
import { average, mapCovidToGeoJSON, dateKey } from "../../scripts/utilities";
import { addClusterLayer, addPointLayer, addCountLayer } from "../../scripts/mapboxUtilities";
import { TimeSelector } from "./timeSelector";
import { covidDatapoints } from "../../scripts/constants";
import { TextInput } from "../textInput/textInput";

export class MapBox extends React.PureComponent<IMapProps, IMapState> {
    container: any = null;
    map: mapboxgl.Map | null = null;
    stylePrefix = "mapbox://styles/mapbox/";
    styles: { [key: string]: IDropdownItem; } = {
        'streets-v11': { name: 'Streets', icon: '' },
        'outdoors-v11': { name: 'Outdoors', icon: '' },
        'satellite-streets-v11': { name: 'Satellite', icon: '' }
    };
    timeFlowSelections: { [key: string]: IDropdownItem } = {
        'auto': { name: 'Auto', icon: 'update' },
        'manual': { name: 'Manual', icon: 'sync_alt' }
    }
    steps: (string | number)[] = [];
    GeoJSONData: GeoJSONWrapper | null = null;
    sortedDateKeys: string[] = [];
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
            geocode: null,
            selectedDate: new Date(),
            timeFlow: 'auto'
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
        new mapboxgl.Marker({
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

        var updateInterval = setInterval(() => {
            if (!this.GeoJSONData || this.state.timeFlow !== 'auto') return;
            if (this.state.selectedDate > this.state.latestDatePoint!) this.setState({ selectedDate: this.state.earliestDatePoint! });
            this.setData(dateKey(this.state.selectedDate));
            this.setState({
                selectedDate: this.state.selectedDate.addDays(1)
            });
        }, 1000);
    }

    setData(key: string) {
        if (!this.GeoJSONData || !this.map?.isStyleLoaded()) return;
        const data = this.GeoJSONData.data[key];
        this.setState({
            currentData: data
        });
        if (!data) return;
        (this.map?.getSource('covid') as GeoJSONSource)?.setData(data);

    }
    componentDidUpdate() {
        if (!this.props.covidStats || this.map?.getSource('covid')) return;
        this.GeoJSONData = mapCovidToGeoJSON(this.props.covidStats);
        const dates = Object.keys(this.GeoJSONData.data).map((key) => {
            let split = key.split("-");
            return new Date(+split[0], +split[1], +split[2]);
        }).sort((a, b) => a.getTime() - b.getTime());
        this.sortedDateKeys = dates.map((data) => dateKey(data));
        const start = dates[0];
        const end = dates[dates.length - 1];
        const data = this.GeoJSONData.data[dateKey(new Date(2020, 7, 20))];
        const allCountries = this.props.covidStats.map((stat) => stat.Country);
        this.setState({
            selectedDate: start,
            earliestDatePoint: start,
            latestDatePoint: end,
            currentData: data,
            distinctCountries: Array.from(new Set(allCountries))
        });
        this.map?.addSource('covid', {
            type: 'geojson',
            cluster: true,
            data: data,
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
        this.map?.flyTo({
            center: [this.props.longitude, this.props.latitude],
            zoom: 12
        });
    }
    setStyle(key: string) {
        // Prevent crash
        if(this.map?.isMoving()) return;
        
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

    onDateChange(percent: number) {
        if (!this.GeoJSONData) return;
        const spot = Math.ceil((this.sortedDateKeys.length - 1) * ((100 - percent) / 100));
        const key = this.sortedDateKeys[spot];
        this.setData(key);
        const split = key?.split("-");
        if (!split) return;
        const d = new Date(+split[0], +split[1], +split[2]);
        this.setState({
            selectedDate: d
        });
    }
    onTimeFlowChange(key: string) {
        this.setState({
            timeFlow: key as 'auto' | 'manual'
        });
    }

    onCountrySelect(value: string) {
        var result = this.props.covidStats?.filter((filter) => filter.Country === value && filter.Province === "")[0];
        console.log(result);
        if (!result) return;
        this.map?.flyTo({
            center: [+result.Lon, +result.Lat],
            zoom: 4
        });
    }

    render() {
        return <div>
            <div>
                <h1 className="my-8">COVID-19 Tracker</h1>
                <div className="py-2 flex md:justify-between flex-wrap">
                    <Button icon="my_location" onClick={this.centerMap.bind(this)} className="mr-2 my-2 md:my-0 w-full md:w-auto justify-between">Home</Button>
                    <Dropdown
                        autoWidth={false}
                        className="mr-2 my-2 md:my-0 w-full md:w-40"
                        title="Style"
                        icon="map"
                        defaultSelection={this.state.style}
                        items={this.styles}
                        onChange={this.setStyle.bind(this)}
                    />
                    {this.props.covidStats &&
                        <>
                            <Dropdown
                                autoWidth={false}
                                className="my-2 md:my-0 mr-2 w-full md:w-40"
                                title="Data point"
                                icon="info"
                                defaultSelection={this.state.dataPoint}
                                items={covidDatapoints}
                                onChange={this.setDataPoint.bind(this)}
                            />
                            <Dropdown
                                autoWidth={false}
                                className="my-2 md:my-0 mr-2 w-full md:w-40"
                                title="Time flow"
                                icon="schedule"
                                defaultSelection={this.state.timeFlow}
                                items={this.timeFlowSelections}
                                onChange={this.onTimeFlowChange.bind(this)}
                            />
                            <TextInput icon="search" className="my-2 md:my-0 w-full md:w-auto" autoCompleteValues={this.state.distinctCountries} onComplete={this.onCountrySelect.bind(this)} />
                        </>
                    }
                </div>
            </div>
            <div className="relative">
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
                <div className="w-full" style={{ height: '400px' }} ref={el => this.container = el}></div>
            </div>
            {this.state.earliestDatePoint && this.state.latestDatePoint &&
                <TimeSelector
                    currentTime={this.state.selectedDate}
                    startDate={this.state.earliestDatePoint}
                    endDate={this.state.latestDatePoint}
                    onSliderDrag={this.onDateChange.bind(this)}
                />}
        </div>
    }
}