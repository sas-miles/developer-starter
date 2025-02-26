import { Environment, OrbitControls, PresentationControls, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useR3F } from './r3fManager';
import { Mesh } from 'three';

interface TestProps {
  mountTimestamp?: number;
  previousPath?: string;
}

function Test({ mountTimestamp, previousPath }: TestProps) {
  const stateRef = useR3F();
  const meshRef = useRef<Mesh>(null);
  const timeRef = useRef<number>(Date.now());

  // Log mount information
  useEffect(() => {
    console.log('[Test] Mounted with props:', { mountTimestamp, previousPath });

    if (stateRef.current) {
      console.log('[Test] Current camera position:', stateRef.current.camera.position.toArray());
    }

    return () => {
      console.log('[Test] Component unmounting');
    };
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Different animation to clearly see the difference
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.z += delta * 0.2;

      // Up and down movement
      meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.5;
    }
  });

  return (
    <>
      <color attach="background" args={['#202030']} />
      <Environment preset="night" />
      <OrbitControls />
      <mesh ref={meshRef}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <meshStandardMaterial color="cyan" />
      </mesh>

      <Text position={[0, 2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        Test Page Scene
      </Text>

      {previousPath && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          {`Previous: ${previousPath}`}
        </Text>
      )}

      <Text position={[0, -2, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        {`Time since mount: ${Math.floor((Date.now() - timeRef.current) / 1000)}s`}
      </Text>
    </>
  );
}

export default Test;
