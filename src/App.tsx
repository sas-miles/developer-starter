// App.tsx
import { Environment, PresentationControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useR3F } from './r3fManager';
import { Mesh } from 'three';

interface AppProps {
  mountTimestamp?: number;
  previousPath?: string;
}

export default function App({ mountTimestamp, previousPath }: AppProps) {
  const stateRef = useR3F();
  const meshRef = useRef<Mesh>(null);

  // Add ref for PresentationControls
  const controlsRef = useRef(null);

  // Log camera state when it changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (stateRef.current) {
        const camera = stateRef.current.camera;
        console.log(
          '[App] Live camera position:',
          camera.position.toArray(),
          'rotation:',
          camera.rotation.toArray()
        );
      }
    }, 5000); // Log every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
      <Environment preset="sunset" />

      {/* Add ref to track controls state */}
      <PresentationControls
        global
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        <mesh ref={meshRef}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      </PresentationControls>
    </>
  );
}
