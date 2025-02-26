// CustomCameraScene.tsx - A scene that uses its own camera position
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import BaseScene from '../BaseScene';
import { useR3FStore } from '../stores/sceneStore';
import type { Vector3Tuple } from 'three';
// This scene will use its own camera position regardless of stored state
const CustomCameraScene: React.FC = () => {
  // Get the camera setter from the store
  const { setCameraPosition, setCameraTarget } = useR3FStore();

  // Get access to the Three.js camera and controls
  const { camera } = useThree();

  // Set custom camera position and target on mount
  useEffect(() => {
    // Define this scene's specific camera position and target
    const sceneSpecificPosition = [0, 3, 8];
    const sceneSpecificTarget = [0, 0, 0];

    // Override the stored camera position in the store
    setCameraPosition(sceneSpecificPosition as Vector3Tuple);
    setCameraTarget(sceneSpecificTarget as Vector3Tuple);

    // Also apply it directly to the camera for immediate effect
    camera.position.set(
      sceneSpecificPosition[0],
      sceneSpecificPosition[1],
      sceneSpecificPosition[2]
    );
  }, [camera, setCameraPosition, setCameraTarget]);

  return (
    <BaseScene>
      {/* Scene-specific content */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="purple" />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </BaseScene>
  );
};

export default CustomCameraScene;
