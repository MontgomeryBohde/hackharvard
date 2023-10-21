import React, { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';

function GlobeComponent() {
  const [points, setPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    // Generate random points
    const randomPoints = Array.from({ length: 100 }, () => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
    }));

    setPoints(randomPoints);

    // Group points into clusters and create polygons
    const clusters = d3.packSiblings(randomPoints.map(d => ({ ...d, r: 4 })));
    const polygonsData = clusters.map(cluster => ({
      lat: cluster.y - 90,
      lng: cluster.x,
      radius: cluster.r,
      label: 'Cluster',
    }));

    setPolygons(polygonsData);
  }, []);

  const handlePolygonClick = (polygon) => {
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
      polygonLabel="label"
      onPolygonClick={handlePolygonClick}
    />
  );
}

export default GlobeComponent;
