/// <reference types="react-scripts" />

import { BoxZoomHandler } from "mapbox-gl";


export interface IAppState {
    position: Position;
    covidStats?: COVID.Stats[];
    loadingCovid: boolean;
}

export interface IMapProps {
    latitude: number;
    longitude: number;
    zoom: number;
    loaders?: IStatusBoxLoader[];
    covidStats?: COVID.Stats[];
}

export interface IStatusBoxLoader {
    icon?: string;
    additionalIconClass?: string;
    title: string;
    className?: string;
}

export interface IMapState extends IMapProps {
    style: string;
    dataPoint: string;
    shouldReGeocode: bool;
    geocode: IGeocodingResponse | null;
}

export interface IButtonProps {
    onClick?: MouseEventHandler<T>;
    className?: string;
    icon?: string;
}

export interface IGeocodingResponse {
    features: IGeocodingFeature[];
}

export interface IGeocodingFeature {
    address: string;
    place_name: string;
    place_type: string[];
    text: string;
}

export interface IDropdownProps {
    className?: string;
    autoWidth: boolean;
    defaultSelection: string;
    icon?: string;
    title?: string;
    onChange: (selected: string) => void;
    items: { [key: string]: IDropdownItem };
}

export interface IDropdownState {
    selected: string;
}

export interface IDropdownItem {
    name: string;
    icon?: string;
}

namespace COVID {
    export interface Stats {
        Country: string,
        CountryCode: string,
        Lat: string,
        Lon: string,
        Confirmed: number,
        Deaths: number,
        Recovered: number,
        Active: number,
        Date: string,
        LocationID: string
    }
}

export interface ISettings {
    mapbox: string;
}

export interface IStatusBox {
    className?: string;
}

export interface GeoJSONWrapper {
    data: {[key: string]: GeoJSON.FeatureCollection<GeoJSON.Geometry>};
    totals: {[key: string]: number[]}
}
export interface ISimpleDate {
    year: number;
    day: number;
    month: number;
}
declare global {
    interface Date {
        addDays: (days: number) => Date;
    }
}
