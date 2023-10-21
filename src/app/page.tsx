'use client'

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicGlobeComponent = dynamic(() => import('../../components/globe5'), {
  ssr: false
});

function Home() {
  return (
    <div>
      <h1>My Globe App</h1>
      <DynamicGlobeComponent />
    </div>
  );
}

export default Home;
