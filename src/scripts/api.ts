import { COVID } from "../react-app-env";

export function getCOVIDSummary() {
    return new Promise<COVID.Stats[]>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.covid19api.com/all', true);
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