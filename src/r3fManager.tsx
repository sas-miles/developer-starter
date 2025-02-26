// r3fManager.ts
import React, { createContext, useContext, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { createRoot } from 'react-dom/client';
import type { RootState } from '@react-three/fiber';

export const R3FContext = createContext<any>(null);

const R3FProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This ref will store the R3F state
  const stateRef = useRef<RootState | null>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (stateRef.current) {
        // Capture PresentationControls state by getting the actual world matrix of the camera
        const camera = stateRef.current.camera;
        const position = camera.position.clone();
        const quaternion = camera.quaternion.clone();
        const rotation = camera.rotation.toArray();

        const state = {
          cameraPosition: position.toArray(),
          cameraRotation: rotation,
          cameraQuaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
          zoom: camera.zoom,
          timestamp: Date.now(),
        };

        console.log('[R3F] Saving camera state:', state);
        sessionStorage.setItem('r3f-state', JSON.stringify(state));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <R3FContext.Provider value={stateRef}>
      <Canvas
        onCreated={(state) => {
          // Store the state in our ref
          stateRef.current = state;

          // Restore saved state if available
          const savedState = sessionStorage.getItem('r3f-state');
          if (savedState) {
            try {
              const parsedState = JSON.parse(savedState);
              console.log('[R3F] Restoring camera state:', parsedState);

              // Apply position
              if (parsedState.cameraPosition) {
                state.camera.position.fromArray(parsedState.cameraPosition);
              }

              // Apply rotation - use quaternion if available for more accurate rotation
              if (parsedState.cameraQuaternion) {
                state.camera.quaternion.set(
                  parsedState.cameraQuaternion[0],
                  parsedState.cameraQuaternion[1],
                  parsedState.cameraQuaternion[2],
                  parsedState.cameraQuaternion[3]
                );
              } else if (parsedState.cameraRotation) {
                state.camera.rotation.fromArray(parsedState.cameraRotation);
              }

              // Apply zoom if it exists
              if (parsedState.zoom) {
                state.camera.zoom = parsedState.zoom;
                state.camera.updateProjectionMatrix();
              }
            } catch (e) {
              console.error('[R3F] Failed to restore state:', e);
            }
          }
        }}
      >
        {children}
      </Canvas>
    </R3FContext.Provider>
  );
};

// Hook to access the R3F context
export const useR3F = () => useContext(R3FContext);

// Function to initialize R3F in Webflow
export const initR3F = (containerId: string, Scene: React.ComponentType, props = {}) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[R3F] Container #${containerId} not found`);
    return;
  }

  console.log(`[R3F] Mounting scene in #${containerId}`);

  const root = createRoot(container);
  root.render(
    <R3FProvider>
      <Scene {...props} />
    </R3FProvider>
  );

  return root; // Return root for potential cleanup
};
