'use client'

import '../src/app/globals.css';
import React from 'react';
import dynamic from 'next/dynamic';

const DynamicGlobeComponent = dynamic(() => import('../components/globe8'), {
  ssr: false
});

function globes() {
  return (
    <div>
      <DynamicGlobeComponent />
    </div>
  );
}

export default globes;

