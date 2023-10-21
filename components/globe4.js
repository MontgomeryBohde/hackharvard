import React, { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import convexHull from 'convex-hull';

function GlobeComponent() {
    const [points, setPoints] = useState([]);
    const [polygons, setPolygons] = useState([]);

    useEffect(() => {
      const randomPoints = Array.from({ length: 100 }, () => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
      }));
  

        setPoints(randomPoints);

        const distance = (p1, p2) => {
            return Math.sqrt(Math.pow(p2.lat - p1.lat, 2) + Math.pow(p2.lng - p1.lng, 2));
        };

        // Group points into clusters
        let clusters = [];
        randomPoints.forEach(pt => {
            let foundCluster = false;
            for (let cluster of clusters) {
                if (cluster.some(clusterPt => distance(clusterPt, pt) < 1000)) {
                    cluster.push(pt);
                    foundCluster = true;
                    break;
                }
            }
            if (!foundCluster) {
                clusters.push([pt]);
            }
        });

        // Only consider clusters with more than 3 points for polygon formation
        clusters = clusters.filter(cluster => cluster.length > 3);

        // Create convex hulls for each cluster
        const polygonsData = clusters.map(cluster => {
            const hullPoints = convexHull(cluster.map(p => [p.lng, p.lat]));
            const coordinates = [hullPoints.map(hp => [hp[0], hp[1]])];
            return {
                type: "Feature",
                geometry: {
                    type: 'Polygon',
                    coordinates: coordinates
                },
                properties: {
                    label: 'Cluster'
                }
            };
        });

        console.log(polygonsData); // Let's log to verify the format

        setPolygons(polygonsData);
    }, []);

    const handlePolygonClick = () => {
        window.alert('Polygon Clicked!');
    };

    return (
        <Globe
            globeImageUrl="/globe.jpeg"
            width={window.innerWidth}
            height={window.innerHeight}
            pointsData={points}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => 'red'}
            pointRadius={0.2}
            polygonsData={polygons}
            polygonCapColor={() => 'rgba(255, 0, 0, 0.5)'}
            polygonSideColor={() => 'red'}
            polygonLabel="properties.label"
            onPolygonClick={handlePolygonClick}
        />
    );
}

export default GlobeComponent;
