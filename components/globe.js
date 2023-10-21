'use client';

import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

function GlobeComponent() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);

  useEffect(() => {
    fetch('/path_to_datasets/ne_110m_admin_0_countries.geojson').then(res => res.json())
      .then(data => {
        setCountries(data);

        setTimeout(() => {
          setTransitionDuration(4000);
          setAltitude(() => feat => Math.max(0.1, Math.sqrt(+feat.properties.POP_EST) * 7e-5));
        }, 3000);
      });
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;

    globeEl.current.pointOfView({ altitude: 4 }, 5000);
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/globe.jpeg"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonAltitude={altitude}
      polygonCapColor={() => 'rgba(200, 0, 0, 0.6)'}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
      `}
      polygonsTransitionDuration={transitionDuration}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}

export default GlobeComponent;
