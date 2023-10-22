import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as satellite from 'satellite.js';
import * as THREE from 'three';

const EARTH_RADIUS_KM = 6371;
const SAT_SIZE = 80;
const TIME_STEP = 1;

function GlobeComponent() {
  const globeEl = useRef();
  const [satData, setSatData] = useState([]);
  const [manualPoints, setManualPoints] = useState([]);
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());
  const [drawingMode, setDrawingMode] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  console.log('satData:', satData);  // <-- added
  console.log('manualPoints:', manualPoints);  // <-- added
  console.log('polygonPoints:', polygonPoints);  // <-- added

  if (!Array.isArray(polygonPoints)) {
    console.error('polygonPoints is not an array!', polygonPoints);
  }

  useEffect(() => {
    (function frameTicker() {
      requestAnimationFrame(frameTicker);
      setTime((prevTime) => new Date(+prevTime + TIME_STEP));
    })();
  }, []);

  useEffect(() => {
    fetch('//unpkg.com/globe.gl/example/datasets/space-track-leo.txt')
      .then((r) => r.text())
      .then((rawData) => {
        const tleData = rawData
          .replace(/\r/g, '')
          .split(/\n(?=[^12])/)
          .filter((d) => d)
          .map((tle) => tle.split('\n'));

        const sats = tleData.map(([name, ...tle]) => ({
          satrec: satellite.twoline2satrec(...tle),
          name: name.trim().replace(/^0 /, ''),
        }))
        .filter((d) => !!satellite.propagate(d.satrec, new Date()).position)
        .slice(0, 1500);

        console.log('Fetched sats:', sats);  // <-- added

        setSatData(sats);
      });
  }, []);

  useEffect(() => {
    setManualPoints([
        { name: 'Point 1', lat: 34.0522, lng: -118.2437, alt: 0.1, lngSpeed: 0.1, latSpeed: 0.05 }, 
        { name: 'Point 2', lat: 40.7128, lng: -74.0060, alt: 0.15, lngSpeed: -0.1, latSpeed: 0.02 },
    ]);
  }, []);

  const handleGlobeClick = (event) => {
    if (drawingMode && polygonPoints.length < 4) {
        const [lat, lng] = globeEl.current.getCoords(event);
        setPolygonPoints(prevPoints => [...prevPoints, { latitude: lat, longitude: lng }]);
        setFeedbackMessage(`Placed point ${polygonPoints.length + 1}. ${3 - polygonPoints.length} points left.`);
    }
  }

  useEffect(() => {
    console.log("Current Polygon Points:", polygonPoints);  // <-- added
  }, [polygonPoints]);

  useEffect(() => {
    setManualPoints((prevPoints) => {
      return prevPoints.map(point => ({
        ...point,
        lat: point.lat + point.latSpeed,
        lng: point.lng + point.lngSpeed,
      }));
    });
  }, [time]);

  const pathsData = useMemo(() => {
    console.log("Computing pathsData for:", polygonPoints);  // <-- added

    if (polygonPoints.length < 2) return [];

    let paths = [];
    for (let i = 0; i < polygonPoints.length - 1; i++) {
        paths.push({
            startLat: polygonPoints[i].latitude,
            startLng: polygonPoints[i].longitude,
            endLat: polygonPoints[i + 1].latitude,
            endLng: polygonPoints[i + 1].longitude,
            color: 'blue'
        });
    }

    if (polygonPoints.length === 4) {
        paths.push({
            startLat: polygonPoints[3].latitude,
            startLng: polygonPoints[3].longitude,
            endLat: polygonPoints[0].latitude,
            endLng: polygonPoints[0].longitude,
            color: 'blue'
        });
    }

    console.log("Generated pathsData:", paths);  // <-- added
    return paths;
  }, [polygonPoints]);

  const objectsData = useMemo(() => {
    const gmst = satellite.gstime(time);
    const existingSatellitesData = satData.map((d) => {
      const eci = satellite.propagate(d.satrec, time);
      if (eci.position) {
        const gdPos = satellite.eciToGeodetic(eci.position, gmst);
        const lat = satellite.radiansToDegrees(gdPos.latitude);
        const lng = satellite.radiansToDegrees(gdPos.longitude);
        const alt = gdPos.height / EARTH_RADIUS_KM;
        return { ...d, lat, lng, alt };
      }
      return d;
    });

    const manualPointsData = manualPoints.map(pt => ({
      ...pt,
      type: 'manual'
    }));

    const drawnPoints = polygonPoints.map((pt, i) => ({
      name: `Polygon Pt ${i + 1}`,
      lat: pt.latitude,
      lng: pt.longitude,
      alt: 0,
      type: 'polygon',
    }));

    return [...existingSatellitesData, ...manualPointsData, ...drawnPoints];
  }, [time, satData, manualPoints, polygonPoints]);

  console.log("Generated objectsData:", objectsData);  // <-- added

  return (
    <div onClick={handleGlobeClick}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        pathsData={pathsData}
        arcsData={objectsData}
      />
    </div>
  );
}

export default GlobeComponent;
