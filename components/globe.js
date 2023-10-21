import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls

function Globe() {
  const globeRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 32, 32),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('/globe.jpeg') })
    );

    camera.position.z = 5;
    scene.add(globe);

    // Create an instance of OrbitControls and attach it to the camera
    const controls = new OrbitControls(camera, renderer.domElement);

    // Disable auto rotation
    controls.autoRotate = false;

    renderer.setSize(window.innerWidth, window.innerHeight);
    globeRef.current.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);

      // Handle mouse interaction with controls
      controls.update();

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={globeRef}></div>;
}

export default Globe;
