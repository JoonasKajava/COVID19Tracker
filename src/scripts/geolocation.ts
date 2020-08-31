import { settings } from "../settings";
import { IGeocodingResponse } from "../react-app-env";

export function getGeoLocation() {
    return new Promise<Position>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position);
        }, (error: PositionError) => {
            reject(error);
        });
    });
}

export function reverseGeocodingFromCoords(latitude: number, longitude: number) : Promise<IGeocodingResponse> {
    return reverseGeocoding([longitude, latitude], ['country','address']);
}

export function reverseGeocoding(location: number[] | string[], dataTypes: string[]) : Promise<IGeocodingResponse> {
    return new Promise<IGeocodingResponse>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.join(',')}.json?types=${dataTypes.join(',')}&access_token=${settings['mapbox']}`, true);

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
            }
        };
        xhr.onerror = () => {
            reject();
        }
        xhr.send();
    });
}