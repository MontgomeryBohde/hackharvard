import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as satellite from 'satellite.js';
import * as THREE from 'three';
import {fetchNavSats, fetchImgSats, fetchComSats, fetchWeatherSats} from '../src/app/requests'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { redirect } from 'next/navigation';
const rsatcount = 10; // Number of random satellites to spawn
const rsatoff = 0.5; // Max lat/lng deviation for the random satellites
const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 100; // per frame
const introPanelStyles = {
  position: 'absolute',
  top: '10%',
  right: '-400px', 
  width: '350px',
  height: '80%',
  background: 'linear-gradient(150deg, #f5f7fa, #c3cfe2)',
  padding: '20px',
  boxShadow: '-10px 0 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.5s ease-in-out',
  fontFamily: "'Roboto', sans-serif",
  borderRadius: '15px 0 0 15px',
  overflowY: 'auto'
};
const satColors = {
  user: 'red',
  nav: 'blue',
  img: 'yellow',
  com: 'green',
  weather: 'orange',  // changed to orange to differentiate from user points
};
const SHAPES = ['Box', 'Sphere', 'Cone'];
const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33D6'];
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const introPanelActiveStyles = {
  ...introPanelStyles,
  right: '10px'
};

const h2Styles = {
  color: '#333',
  fontSize: '24px',
  marginBottom: '15px'
};

const pStyles = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '1.4',
  marginBottom: '10px'
};

const highlightStyles = {
  ...pStyles,
  color: '#007BFF',
  fontWeight: 'bold'
};

// Import the CSS file dynamically
function loadCSS(file) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = file;
  document.head.appendChild(link);
}
function saty(lat, lng, type, count = 5) {
  return Array.from({ length: count }).map((_, idx) => ({
    satrec: satellite.twoline2satrec(
      '1 00000U 00000A 00000.00000000 00000.00000000 00000.00000000 0.00000000 0.00000000 0.00000000 0',
      '2 00000 000.0000 000.0000 0000000 000.0000 000.0000 00.00000000000000'
    ),
    color: red,
    satid: Date.now() + idx,  // unique ID based on the current time and the index
    satname: `${type.toUpperCase()} SAT ${idx}`,
    intDesignator: '2023-001A',  // example designator
    launchDate: '2023-01-01',  // example launch date
    satlat: lat + (Math.random() - 0.5) * 100,  // latitude with a small random offset
    satlng: lng + (Math.random() - 0.5) * 100,  // longitude with a small random offset
    satalt: 35789.6607,  // fixed altitude for this example
    type  // custom type field (e.g., 'nav', 'img', etc.)
  }));
}

const gena = (lat, lng, count = rsatcount) => {
  return Array.from({ length: count }).map((_, idx) => {
    return {
      name: `SAT ${idx}`,
      lat: lat + (Math.random() - 0.5) * 20 * rsatoff,
      lng: lng + (Math.random() - 0.5) * 20 * rsatoff,
      color: 'red',
      alt: 0,
      type: 'random', // Added this type to differentiate the random satellites (you can style them differently if you want)
    };
  });
};

// Call the function to load your CSS file
loadCSS("../src/app/globe.css");
function GlobeComponent() {
  const globeEl = useRef();
  const [satData, setSatData] = useState([]);
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());
  const [showIntro, setShowIntro] = useState(true);


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
          .map(([name, ...tle]) => {
            const satrec = satellite.twoline2satrec(...tle);
            if (!satrec) return null;
            return {
              satrec,
              name: name.trim().replace(/^0 /, ''),
            };
          })
          .filter(d => d && satellite.propagate(d.satrec, new Date()).position)
          .slice(0, 1500);
        

        setSatData(sats);
      });
  }, []);

  const objectsData = useMemo(() => {
    if (!satData) return [];
  
    const gmst = satellite.gstime(time);
    return satData.map((d) => {
      if (!d.satrec) return d;
  
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
    console.log(d);  
    if (!globeRadius) return undefined;

    let geometry;
    let color = 'green';

    if (d.isUserPoint) {
      const actualRadius = d.radius || (SAT_SIZE * globeRadius / EARTH_RADIUS_KM);  // Double the size for user points
      geometry = new THREE.BoxGeometry(  // Use BoxGeometry for a cube
        actualRadius,
        actualRadius,
        actualRadius
      );
      color = 'brightred';  // Bright red color
    } else if (d.isNewSatellite) { // New condition for newly added satellites
      geometry = new THREE.BoxGeometry(
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM,
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM,
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM
      );
      color = 'purple'; // Bright purple color for newly added satellites
    } else {
      geometry = new THREE.OctahedronGeometry(
        SAT_SIZE * globeRadius / EARTH_RADIUS_KM / 2,
        0
      );
      color = satColors[d.type];
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
    setShowIntro(false)

    const { lat, lng } = event;
   /*const navSats = saty(lat, lng, 'nav', 5 + Math.floor(Math.random() * 6));  // 5-10 nav satellites
    const imgSats = saty(lat, lng, 'img', 5 + Math.floor(Math.random() * 6));  // 5-10 img satellites
    const comSats = saty(lat, lng, 'com', 5 + Math.floor(Math.random() * 6));  // 5-10 com satellites
    const weatherSats = saty(lat, lng, 'weather', 5 + Math.floor(Math.random() * 6));  // 5-10 weather satellites*/
  
    // 1. Fetching Satellite Data:
    
    const navSats = await fetchNavSats(lat, lng);
    const imgSats = await fetchImgSats(lat, lng);
    const comSats = await fetchComSats(lat, lng);
    const weatherSats = await fetchWeatherSats(lat, lng);
    console.log('Nav Sats:', navSats);
    console.log('Img Sats:', imgSats);
    console.log('Com Sats:', comSats);
    console.log('Weather Sats:', weatherSats);


    // 2. Merging and Rendering Satellite Data:
    const allSats = [
      ...navSats.map(sat => ({ ...sat, type: 'nav', isNewSatellite: true ,isUserPoint: true})),
      ...imgSats.map(sat => ({ ...sat, type: 'img', isNewSatellite: true ,isUserPoint: true})),
      ...comSats.map(sat => ({ ...sat, type: 'com', isNewSatellite: true ,isUserPoint: true})),
      ...weatherSats.map(sat => ({ ...sat, type: 'weather', isNewSatellite: true ,isUserPoint: true}))
  ];
  


    const satName = window.prompt('Enter satellite name:');
    if (!satName) return; // Exit if no name entered

    const enteredRadius = parseFloat(window.prompt('Enter radius (in km):'));
    if (isNaN(enteredRadius)) return;

    const newSat = {
      //satrec: satellite.twoline2satrec('1 00000U 00000A 00000.00000000 00000.00000000 00000.00000000 0.00000000 0.00000000 0.00000000 0', '2 00000 000.0000 000.0000 0000000 000.0000 000.0000 00.00000000000000'),
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
    const rsat = gena(lat, lng);

    setSatData((prevSatData) => [...prevSatData, ...navSats, ...imgSats, ...comSats, ...weatherSats, ...rsat]);
  };


  return (
    <div>
      {showIntro && (
      <div style={showIntro ? introPanelActiveStyles : introPanelStyles}>
  <h2 style={h2Styles}>Welcome to Drifts.space!</h2>
  <p style={pStyles}>
    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
    In times of global disasters, timely satellite data is paramount. We analyze 10,000+ satellites to create the best constellation for disaster regions.
  </p>
  <p style={pStyles}>
    <FontAwesomeIcon icon={faHandPointer} style={{ marginRight: '8px' }} />
    Begin by clicking on a disaster region. Our system will do the rest, ensuring efficient satellite tracking for the zone.
  </p>
  <p style={highlightStyles}>
    Click on the globe to embark on a journey towards efficient and reliable disaster responses!
  </p>
</div>

    
    
    
    )}
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