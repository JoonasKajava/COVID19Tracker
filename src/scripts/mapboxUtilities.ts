export function addClusterLayer(map: mapboxgl.Map | null, dataPoint: string, colorSteps: any[]){
    if(map?.getLayer('clusters')) map.removeLayer('clusters');
    map?.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'covid',
        filter: ['has', 'point_count'],
        paint: {
            "circle-color": [
                'step',
                ['get', dataPoint],
                ...colorSteps
            ],
            "circle-radius": ["*", ["+", ["floor", ["log10", ["abs", ['get', dataPoint]]]], 1], 6]
        }
    });
}

export function addPointLayer(map: mapboxgl.Map | null, dataPoint: string, colorSteps: any[]) {
    if(map?.getLayer('unclustered-point')) map.removeLayer('unclustered-point');
    map?.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'covid',
        filter: ['!', ['has', 'point_count']],
        paint: {
            "circle-color": [
                'step',
                ['get', dataPoint],
                ...colorSteps
            ],
            "circle-radius": ["*", ["+", ["floor", ["log10", ["abs", ['get', dataPoint]]]], 1], 6]
        }
    });
}

export function addCountLayer(map: mapboxgl.Map | null, dataPoint: string, colorSteps: any[]) {
    if(map?.getLayer('confirmed-count')) map.removeLayer('confirmed-count');
    map?.addLayer({
        id: 'confirmed-count',
        type: 'symbol',
        source: 'covid',
        layout: {
            "text-field": ['get', dataPoint]
        }
    });
}