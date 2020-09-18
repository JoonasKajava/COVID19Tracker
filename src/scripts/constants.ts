import { ICovidDatapoint } from "../react-app-env";


export const covidDatapoints: { [key: string]: ICovidDatapoint } = {
    'confirmed': { name: 'Confirmed', icon: 'done' },
    'deaths': { name: 'Deaths', icon: 'sentiment_very_dissatisfied' },
    'recovered': { name: 'Recovered', icon: 'emoji_people' },
    'active': { name: 'Active', icon: 'coronavirus' }
};