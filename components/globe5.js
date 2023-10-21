import React, { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

function GlobeComponent() {
    const [satellites] = useState([
        { id: 1, name: "Satellite 1", lat: 34.05, lng: -118.25, altitude: 0.05 },
        { id: 2, name: "Satellite 2", lat: 40.71, lng: -74.01, altitude: 0.07 },
        { id: 3, name: "Satellite 3", lat: 51.51, lng: -0.13, altitude: 0.06 },
        { id: 4, name: "Satellite 4", lat: 48.86, lng: 2.35, altitude: 0.04 },
        { id: 5, name: "Satellite 5", lat: -33.87, lng: 151.21, altitude: 0.08 },
        { id: 6, name: "Satellite 6", lat: 35.68, lng: 139.76, altitude: 0.06 },
        { id: 7, name: "Satellite 7", lat: 55.75, lng: 37.62, altitude: 0.09 },
        { id: 8, name: "Satellite 8", lat: 39.91, lng: 116.40, altitude: 0.05 },
        { id: 9, name: "Satellite 9", lat: 22.28, lng: 114.16, altitude: 0.07 },
        { id: 10, name: "Satellite 10", lat: -23.55, lng: -46.63, altitude: 0.08 },
        { id: 11, name: "Satellite 11", lat: 37.77, lng: -122.42, altitude: 0.07 },
        { id: 12, name: "Satellite 12", lat: -26.20, lng: 28.04, altitude: 0.06 },
        { id: 13, name: "Satellite 13", lat: 19.43, lng: -99.13, altitude: 0.09 },
        { id: 14, name: "Satellite 14", lat: -12.97, lng: -38.50, altitude: 0.05 },
        { id: 15, name: "Satellite 15", lat: 59.33, lng: 18.07, altitude: 0.04 },
        { id: 16, name: "Satellite 16", lat: 52.37, lng: 4.89, altitude: 0.09 },
        { id: 17, name: "Satellite 17", lat: 41.90, lng: 12.49, altitude: 0.06 },
        { id: 18, name: "Satellite 18", lat: -6.17, lng: 106.82, altitude: 0.08 },
        { id: 19, name: "Satellite 19", lat: 1.29, lng: 103.85, altitude: 0.04 },
        { id: 20, name: "Satellite 20", lat: 3.14, lng: 101.68, altitude: 0.07 },
              // ... more satellites
    ]);
    const [polygons, setPolygons] = useState([]);

    useEffect(() => {
        // You can create polygons based on the satellites data here if needed
        // For example, if you want to connect satellites that are close to each other

        // Dummy polygons data, you should replace it with actual logic
        const polygonsData = [
          {
            type: "Feature",
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-118.25, 34.05],
                  [-74.01, 40.71],
                  // ... more coordinates
                ]
              ]
            },
            properties: {
              label: 'Satellite Connection'
            }
          }
        ];

        setPolygons(polygonsData);
    }, [satellites]);

    const handleSatelliteClick = satellite => {
      window.alert(`Satellite Clicked: ${satellite.name}`);
    };

    return (
        <Globe
            globeImageUrl="/globe.jpeg"
            width={window.innerWidth}
            height={window.innerHeight}
            pointsData={satellites}
            pointAltitude={satellite => satellite.altitude}
        
            pointLat="lat"
            pointLng="lng"
            pointColor={() => 'blue'}
            pointRadius={0.5}
            pointLabel="name"
            onPointClick={handleSatelliteClick}
            polygonsData={polygons}
            polygonCapColor={() => 'rgba(255, 0, 0, 0.5)'}
            polygonSideColor={() => 'red'}
            polygonLabel="properties.label"
        />
    );
}

export default GlobeComponent;
