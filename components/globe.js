'use client'

import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl';  

function GlobeComponent() {
  const globeEl = useRef(null);

  useEffect(() => {
    const myGlobe = Globe()   
      .globeImageUrl('/globe.jpeg')(globeEl.current);  

    window.addEventListener('resize', () => {
      myGlobe.width(window.innerWidth).height(window.innerHeight);
    });
  }, []);

  return <div ref={globeEl} style={{ width: '100%', height: '100vh' }}></div>;
}

export default GlobeComponent;
