/// <reference types="react-scripts" />

import { BoxZoomHandler } from "mapbox-gl";


export interface IAppState {
    position : Position;
}

export interface IMapProps {
    latitude: number;
    longitude: number;
    zoom: number;
}

export interface IMapState extends IMapProps {
    style: string;
    shouldReGeocode: bool;
    geocode: IGeocodingResponse | null;
}

export interface IButtonProps {
    onClick?: MouseEventHandler<T>;
    className?: string;
    icon?: string;
}


export interface IInfoBoxProps {
    latitude: number;
    longitude: number;
    zoom: number;
    geocode?: IGeocodingResponse | null;
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
    defaultSelection: string;
    icon?: string;
    title?: string;
    onChange: (selected: string) => void;
    items: {[key:string]: IDropdownItem};
}

export interface IDropdownState {
    selected: string;
}

export interface IDropdownItem {
    name: string;
    icon: string;
}

namespace COVID {
    namespace Summary {
        export interface Stats {
            NewConfirmed: number;
            TotalConfirmed: number;
            NewDeaths: number;
            TotalDeaths: number;
            NewRecovered: number;
            TotalRecovered
        }
        export interface CountryStats extends Stats {
            Country: string;
            CountryCode: string;
            Slug: string;
            Date: string;
        }
        export interface Result {
            Global: Stats;
            Countries: CountryStats[];
        }
    }
}