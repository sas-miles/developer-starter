// r3fManager.ts - Core framework functionality
import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import R3FProvider from './r3fProvider';
import BaseScene from './BaseScene';
import { useR3FStore } from './stores/sceneStore';

// Type definition for scene map
interface SceneMap {
  [key: string]: React.ComponentType;
}

// Add this to fix Window type issue
declare global {
  interface Window {
    Webflow?: any[];
  }
}

// Function to initialize R3F in Webflow
export const initR3F = (containerId: string, Scene: React.ComponentType): Root | undefined => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[R3F] Container #${containerId} not found`);
    return undefined;
  }

  const root = createRoot(container);
  root.render(
    <R3FProvider>
      <Scene />
    </R3FProvider>
  );

  return root;
};

// WebflowR3F class
export class WebflowR3F {
  private initialized = false;
  private currentRoot: Root | undefined = undefined;

  constructor(private sceneMap: SceneMap = {}) {}

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Initialize Webflow array if it doesn't exist
    window.Webflow = window.Webflow || [];
    window.Webflow.push(() => {
      this.mountScene();

      // Handle page transitions
      window.addEventListener('beforeunload', () => this.unmountScene());
      document.addEventListener('DOMContentLoaded', () => this.mountScene());
    });
  }

  private mountScene(): void {
    const path = window.location.pathname;
    console.log(`[WebflowR3F] Mounting scene for path: ${path}`);

    // Get the default scene or create a basic one if none is provided
    const defaultScene =
      Object.values(this.sceneMap)[0] ||
      (() => (
        <BaseScene>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial color="blue" />
          </mesh>
        </BaseScene>
      ));

    // Use the specific scene for the current path or the default
    const SceneComponent = this.sceneMap[path] || defaultScene;
    this.currentRoot = initR3F('r3f-container', SceneComponent);
  }

  private unmountScene(): void {
    console.log('[WebflowR3F] Unmounting scene');

    if (this.currentRoot) {
      try {
        this.currentRoot.unmount();
      } catch (e) {
        console.error('[WebflowR3F] Error unmounting:', e);
      }
    }
  }

  // Method to manually reset state
  public resetState(): void {
    const { resetState } = useR3FStore.getState();
    resetState();
  }
}

// Re-export components for easier imports
export { default as BaseScene } from './BaseScene';
