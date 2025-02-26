// r3fProvider.tsx - With page-specific camera support
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSessionCheck, useR3FStore, usePageCamera } from './stores/sceneStore';
import { Vector3 } from 'three';

// Main provider component
const R3FProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check session validity
  useSessionCheck();

  // Reference to the OrbitControls component
  const controlsRef = useRef<any>(null);

  // Get the current path
  const currentPath = window.location.pathname;

  // Get camera settings for this page
  const { position, target } = usePageCamera(currentPath);

  // Get state setters from Zustand
  const { setCameraPosition, setCameraTarget } = useR3FStore();

  // Convert target to Vector3 for the controls
  const targetVector = new Vector3(...target);

  return (
    <Canvas camera={{ position: position }}>
      {children}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={targetVector}
        onChange={() => {
          if (controlsRef.current) {
            // Access the properties safely through the ref
            const controls = controlsRef.current;
            const camera = controls.object;

            // Save camera position and target
            setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);

            setCameraTarget([controls.target.x, controls.target.y, controls.target.z]);
          }
        }}
      />
    </Canvas>
  );
};

export default R3FProvider;
