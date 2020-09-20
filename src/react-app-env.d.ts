/// <reference types="react-scripts" />

import { BoxZoomHandler } from "mapbox-gl";


export interface IAppState {
    position?: Position;
    covidStats?: COVID.Stats[];
    loadingCovid: boolean;
    errors?: IAppError[];
}

export interface IAppError {
    id: 'covidStats';
    timestamp: Date;
    retryIn: number;
    title: string;
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
    selectedDate: Date;
    timeFlow: 'auto' | 'manual';
    earliestDatePoint?: Date;
    latestDatePoint?: Date;
    dataPoint: string;
    shouldReGeocode: bool;
    geocode: IGeocodingResponse | null;
    currentData?: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    distinctCountries?: string[]
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
        Country: string;
        Province: string;
        CountryCode: string;
        Lat: string;
        Lon: string;
        Confirmed: number;
        Deaths: number;
        Recovered: number;
        Active: number;
        Date: string;
        LocationID: string;
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


export interface ITimeSelectorProps {
    currentTime: Date;
    startDate: Date;
    endDate: Date;
    onSliderDrag?: (percent: number) => void;
}

export interface ICovidDatapoint {
    name: string;
    icon?: string;
}

export interface ITimeSelectorState {
    isDragging: boolean;
    sliderPosPercentage: number;
}

export interface IStatisticsProps {
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    dataPoint: ICovidDatapoint;
}

export interface IStatisticProps {
    data: GeoJSON.Feature<GeoJSON.Geometry>;
    dataPoint: ICovidDatapoint;
}

export interface IStatisticState {
    previousData: GeoJSON.Feature<GeoJSON.Geometry>;
}


export interface ITextInputProps {
    onChange?: (value:string) => void;
    onComplete?: (value: string) => void;
    autoCompleteValues?: string[];
    icon?: string;
    className?: string;
}

export interface ITextInputState {
    value: string;
    selectedIndex: number;
    autoComplete?: string[];
}