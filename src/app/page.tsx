'use client'

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicGlobeComponent = dynamic(() => import('../../components/globe5'), {
  ssr: false,
});

function HomePage() {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Times New Roman, Times, serif',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '4rem',
    textAlign: 'center',
  };

  const scrollButtonStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'underline',
    textAlign: 'center',
  };

  const acronymStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
  };

  const typedText = 'Drifts.space';
  const [displayText, setDisplayText] = useState('');

  const typedButtonText = 'Check it out here!';
  const [displayButtonText, setDisplayButtonText] = useState('');

  const acronym = 'Disaster Relief Infrastructure For Tracking and Safety';
  const [displayAcronymText, setAcronymText] = useState('');

  useEffect(() => {
  // Explicitly specify the type of 'text'
  const updateTextWithDelay = (text: string, setTextFunction: (text: string) => void) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTextFunction(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Adjust the delay as needed

    return () => clearInterval(interval);
  };


    // Use the function to update text sequentially
    updateTextWithDelay(typedText, setDisplayText);

    setTimeout(() => {
      updateTextWithDelay(acronym, setAcronymText);
    }, typedText.length * 100); // Adjust the delay as needed

    setTimeout(() => {
      updateTextWithDelay(typedButtonText, setDisplayButtonText);
    }, (typedText.length + acronym.length) * 100); // Adjust the delay as needed
  }, []);

  const scrollToNextPage = () => {
    window.location.href = '/globes';
  };

  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
  };

  const globeBackgroundStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  };
  

  const contentContainerStyle: React.CSSProperties = {
    position: 'relative',
  };

  return (
    <div style={pageContainerStyle}>
      <div style={globeBackgroundStyle}>
        <DynamicGlobeComponent />
      </div>
      <div style={containerStyle}>
        <div style={contentContainerStyle}>
          <h1 style={headingStyle}>{displayText}</h1>
          <div style={acronymStyle}>{displayAcronymText}</div>
          <div style={scrollButtonStyle} onClick={scrollToNextPage}>
            {displayButtonText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;