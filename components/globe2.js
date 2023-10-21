import React, { useEffect, useRef, useState } from 'react';
import Globe  from 'react-globe.gl';

function GlobeComponent() {
  const globeEl = useRef(null);
  const [pathsData, setPathsData] = useState([]);

  useEffect(() => {
    // Generate random paths
    const N_PATHS = 10;
    const MAX_POINTS_PER_LINE = 10000;
    const MAX_STEP_DEG = 1;
    const MAX_STEP_ALT = 0.015;

    const generatedPathsData = [...Array(N_PATHS).keys()].map(() => {
      let lat = (Math.random() - 0.5) * 90;
      let lng = (Math.random() - 0.5) * 360;
      let alt = 0;

      return [[lat, lng, alt], ...[...Array(Math.round(Math.random() * MAX_POINTS_PER_LINE)).keys()].map(() => {
        lat += (Math.random() * 2 - 1) * MAX_STEP_DEG;
        lng += (Math.random() * 2 - 1) * MAX_STEP_DEG;
        alt += (Math.random() * 2 - 1) * MAX_STEP_ALT;
        alt = Math.max(0, alt);

        return [lat, lng, alt];
      })];
    });

    setPathsData(generatedPathsData);
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/globe.jpeg"

      pathsData={pathsData}
      pathColor={['rgba(0,0,255,0.6)', 'rgba(255,0,0,0.6)']}
      pathDashLength={0.01}
      pathDashGap={0.004}
      pathDashAnimateTime={100000}
    />
  );
}

export default GlobeComponent;
