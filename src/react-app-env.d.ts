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
}

export interface IButtonProps {
    onClick?: MouseEventHandler<T>;
    className?: string;
}