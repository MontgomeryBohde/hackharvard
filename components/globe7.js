import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as satellite from 'satellite.js';
import * as THREE from 'three';

const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 1; // per frame

function GlobeComponent() {
  const globeEl = useRef();
  const [satData, setSatData] = useState([]);
  const [manualPoints, setManualPoints] = useState([]);
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());
  const [polygonVertices, setPolygonVertices] = useState([]);
  const raycaster = new THREE.Raycaster();

  const handleMouseDown = (e) => {
    const coords = globeEl.current.getCoords(e.clientX, e.clientY);
    if (coords) {
      setPolygonVertices([...polygonVertices, coords]);
    }
  };

  useEffect(() => {
    const container = globeEl.current ? globeEl.current.canvas : null;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
    };
}, [polygonVertices]);


  const polygonMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 'yellow',
    linewidth: 2
  }), []);

  const polygonGeometry = useMemo(() => {
    if (polygonVertices.length > 1) {
      const vertices = polygonVertices.map(v => {
        const { x, y, z } = globeEl.current.getXYZfromLatLngAlt(v.lat, v.lng, v.alt || 0);
        return new THREE.Vector3(x, y, z);
      });

      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
      return geometry;
    }
}, [polygonVertices]);


  const getPolygonLine = () => {
    if (polygonGeometry) {
      return new THREE.Line(polygonGeometry, polygonMaterial);
    }
  };


  useEffect(() => {
    // time ticker
    (function frameTicker() {
      requestAnimationFrame(frameTicker);
      setTime((prevTime) => new Date(+prevTime + TIME_STEP));
    })();
  }, []);

  useEffect(() => {
    // load satellite data
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

        setSatData(sats);
      });
  }, []);

  useEffect(() => {
    // Add manual points
    setManualPoints([
        { name: 'Point 1', lat: 34.0522, lng: -118.2437, alt: 0.1, lngSpeed: 0.1, latSpeed: 0.05 }, 
        { name: 'Point 2', lat: 40.7128, lng: -74.0060, alt: 0.15, lngSpeed: -0.1, latSpeed: 0.02 }, 
        // ... add more points as needed
    ]);
  }, []);
  useEffect(() => {
    // Update manual points' position based on their speed attributes
    setManualPoints((prevPoints) => {
      return prevPoints.map(point => ({
        ...point,
        lat: point.lat + point.latSpeed,
        lng: point.lng + point.lngSpeed,
      }));
    });
  }, [time]);

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

    // Adding manual points
    const manualPointsData = manualPoints.map(pt => ({
      ...pt,
      type: 'manual'
    }));

    return [...manualPointsData, ...existingSatellitesData]; 
  }, [satData, time, manualPoints]);

  const getObject3D = (d) => {
    if (d.type === 'manual') {
      const manualGeometry = new THREE.SphereGeometry(
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM / 5,
        32,
        32
      );
      const manualMaterial = new THREE.MeshLambertMaterial({ color: 'red' });
      return new THREE.Mesh(manualGeometry, manualMaterial);
    } else {
      const satGeometry = new THREE.OctahedronGeometry(
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM / 2,
        0
      );
      const satMaterial = new THREE.MeshLambertMaterial({
        color: 'palegreen',
        transparent: true,
        opacity: 0.7,
      });
      return new THREE.Mesh(satGeometry, satMaterial);
    }
  };

  useEffect(() => {
    setGlobeRadius(globeEl.current.getGlobeRadius());
    globeEl.current.pointOfView({ altitude: 3.5 });
  }, []);

  return (
    <div>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        objectsData={objectsData}
        objectLabel="name"
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectFacesSurface={false}
        objectThreeObject={getObject3D}
        customLayerData={polygonVertices.length > 1 ? [{}] : []}
        customThreeObject={getPolygonLine}
      />
      {polygonVertices.map((vertex, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: vertex.y,
            left: vertex.x,
            fontSize: '12px',
            fontFamily: 'sans-serif',
            backgroundColor: 'yellow',
            borderRadius: '50%',
            width: '10px',
            height: '10px',
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      ))}
      <div 
        style={{
          position: 'absolute', 
          fontSize: '12px', 
          fontFamily: 'sans-serif', 
          padding: '5px', 
          borderRadius: '3px', 
          backgroundColor: 'rgba(200, 200, 200, 0.1)', 
          color: 'lavender', 
          bottom: '10px', 
          right: '10px'
        }}>
        {time.toString()}
      </div>
    </div>
  );

}

export default GlobeComponent;
