const fs = require('fs');
const fetch = require('node-fetch');

console.log("Downloading covid stats.");

fetch("https://api.covid19api.com/all").then((response) => {
    response.text().then((json) => {
        fs.writeFile('public/all.json', JSON.stringify(JSON.parse(json)), function(err) {
            console.log("Finished download");
        });
    });
});