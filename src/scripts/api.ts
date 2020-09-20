import { COVID } from "../react-app-env";

export function getCOVIDSummary() {
    return fetch('./all.json').then((response) => {
        return response.json();
    });
}