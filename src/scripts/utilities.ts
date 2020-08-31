import { COVID, GeoJSONWrapper, ISimpleDate } from "../react-app-env";
import { features } from "process";
import { totalmem } from "os";

export function median(values: number[]): number {
    const sorted = values.sort((a, b) => a - b);
    console.dir(JSON.stringify(values));
    const mid = Math.ceil(values.length / 2);
    return values.length % 2 === 0 ? (sorted[mid] + sorted[mid - 1]) / 2 : sorted[mid - 1];
}

export function average(values: number[]) {
    return values.reduce((a, b) => a + b) / values.length;
}

export function mapCovidToGeoJSON(stats: COVID.Stats[]): GeoJSONWrapper {
    let dataList: { [key: string]: number[] } = {
        confirmed: [],
        deaths: [],
        recovered: [],
        active: []
    };
    let r: GeoJSONWrapper = {
        data: {},
        totals:{}
    };

    for (var i = 0; i < stats.length; i++) {
        const date: Date = new Date(stats[i].Date);
        if(!r.data[dateKey(date)]) r.data[dateKey(date)] = { type: "FeatureCollection", features: []}
        r.data[dateKey(date)].features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [+stats[i].Lon, +stats[i].Lat, 0]
            },
            "properties": {
                "id": stats[i].LocationID,
                "country": stats[i].Country,
                "countryCode": stats[i].CountryCode,
                "confirmed": stats[i].Confirmed,
                "deaths": stats[i].Deaths,
                "recovered": stats[i].Recovered,
                "active": stats[i].Active,
                "date": stats[i].Date
            }
        });
        dataList.confirmed.push(stats[i].Confirmed);
        dataList.deaths.push(stats[i].Deaths);
        dataList.recovered.push(stats[i].Recovered);
        dataList.active.push(stats[i].Active);
    }
    r.totals = dataList;
    return r;
}

export function dateKey(date: Date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()].join("-");
}

Date.prototype.addDays = function (days: number) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}