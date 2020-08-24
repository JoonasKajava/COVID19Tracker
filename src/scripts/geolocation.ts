
export function getGeoLocation() {
    return new Promise<Position>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve(position);
        }, (error : PositionError) => {
            reject(error);
        });
    });
}