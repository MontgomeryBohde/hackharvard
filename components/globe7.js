import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as satellite from 'satellite.js';
import * as THREE from 'three';
import {fetchNavSats, fetchImgSats, fetchComSats, fetchWeatherSats} from '../src/app/requests'

const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 100; // per frame

function GlobeComponent() {
  const globeEl = useRef();
  const [satData, setSatData] = useState([]);
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());
  

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

        const sats = tleData
          .map(([name, ...tle]) => ({
            satrec: satellite.twoline2satrec(...tle),
            name: name.trim().replace(/^0 /, ''),
          }))
          .filter((d) => !!satellite.propagate(d.satrec, new Date()).position)
          .slice(0, 1500);

        setSatData(sats);
      });
  }, []);

  const objectsData = useMemo(() => {
    if (!satData) return [];

    const gmst = satellite.gstime(time);
    return satData.map((d) => {
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
  }, [satData, time]);
  const getObjectThreeObject = (d) => {
    if (!globeRadius) return undefined;

    let geometry;
    let color;

    if (d.isUserPoint) {
      const actualRadius = d.radius || (SAT_SIZE * globeRadius / EARTH_RADIUS_KM / 2);
      geometry = new THREE.SphereGeometry(
        actualRadius,
        32,  // widthSegments
        32   // heightSegments
      );
      color = 'red';
    } else {
      geometry = new THREE.OctahedronGeometry(
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM / 2,
        0
      );
      color = 'palegreen';
    }

    const material = new THREE.MeshLambertMaterial({
      color,
      transparent: true,
      opacity: 0.7,
    });

    return new THREE.Mesh(geometry, material);
  };


  const satObject = useMemo(() => {
    if (!globeRadius) return undefined;
  
    const satGeometry = new THREE.OctahedronGeometry(
      SAT_SIZE * globeRadius / EARTH_RADIUS_KM / 2,
      0
    );
  
    // Update the color based on the 'isUserPoint' property of the last added satellite
    const color = satData.length > 0 && satData[satData.length - 1].isUserPoint ? 'red' : 'palegreen';
  
    const satMaterial = new THREE.MeshLambertMaterial({
      color,
      transparent: true,
      opacity: 0.7,
    });
    return new THREE.Mesh(satGeometry, satMaterial);
  }, [globeRadius, satData]);
  
  
  useEffect(() => {
    setGlobeRadius(globeEl.current.getGlobeRadius());
    globeEl.current.pointOfView({ altitude: 3.5 });
  }, []);


  const handleGlobeClick = async (event) => {
    const { lat, lng } = event;

    const satName = window.prompt('Enter satellite name:');
    if (!satName) return; // Exit if no name entered

    const enteredRadius = parseFloat(window.prompt('Enter radius (in km):'));
    if (isNaN(enteredRadius)) return;

    const newSat = {
      satrec: satellite.twoline2satrec('1 00000U 00000A 00000.00000000 00000.00000000 00000.00000000 0.00000000 0.00000000 0.00000000 0', '2 00000 000.0000 000.0000 0000000 000.0000 000.0000 00.00000000000000'),
      name: satName, // Use the user-input name
      lat,
      lng,
      alt: 0,
      radius: enteredRadius * globeRadius / EARTH_RADIUS_KM / 2,
      isUserPoint: true,
    };
    /*const navSats = await fetchNavSats(lat, lng);
    const imgSats = await fetchImgSats(lat, lng);
    const comSats = await fetchComSats(lat, lng);
    const weatherSats = await fetchWeatherSats(lat, lng);
    console.log('Nav Sats:', navSats);
    console.log('Img Sats:', imgSats);
    console.log('Com Sats:', comSats);
    console.log('Weather Sats:', weatherSats);*/

    setSatData((prevSatData) => [...prevSatData, newSat]);
};


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
        objectThreeObject={getObjectThreeObject} // Changed this line
        onGlobeClick={handleGlobeClick}

      />
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
          right: '10px',
        }}
      >
        {time.toString()}
      </div>
    </div>
  );
}

export default GlobeComponent;