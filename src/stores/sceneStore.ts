// stores/sceneStore.ts - Enhanced to support per-page camera state
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Vector3Tuple } from 'three';

// Define our store state
interface R3FState {
  // Camera state
  cameraPosition: Vector3Tuple;
  cameraTarget: Vector3Tuple;

  // Page-specific camera settings
  pageSpecificCameras: Record<
    string,
    {
      position: Vector3Tuple;
      target: Vector3Tuple;
    }
  >;

  // Flag to ignore stored camera state for current page
  ignoreStoredCameraForCurrentPage: boolean;

  // Session tracking
  sessionId: string;
  lastUpdated: number;

  // Actions
  setCameraPosition: (position: Vector3Tuple) => void;
  setCameraTarget: (target: Vector3Tuple) => void;
  setPageSpecificCamera: (page: string, position: Vector3Tuple, target: Vector3Tuple) => void;
  setIgnoreStoredCamera: (ignore: boolean) => void;
  resetState: () => void;
}

// Generate a session ID
const generateSessionId = () => `session-${Date.now()}`;

// Default values
const defaultPosition: Vector3Tuple = [0, 0, 5];
const defaultTarget: Vector3Tuple = [0, 0, 0];

// Create the store with persistence
export const useR3FStore = create<R3FState>()(
  persist(
    (set) => ({
      // Default values
      cameraPosition: defaultPosition,
      cameraTarget: defaultTarget,
      pageSpecificCameras: {},
      ignoreStoredCameraForCurrentPage: false,
      sessionId: generateSessionId(),
      lastUpdated: Date.now(),

      // Actions
      setCameraPosition: (position: Vector3Tuple) =>
        set({
          cameraPosition: position,
          lastUpdated: Date.now(),
        }),
      setCameraTarget: (target: Vector3Tuple) =>
        set({
          cameraTarget: target,
          lastUpdated: Date.now(),
        }),
      setPageSpecificCamera: (page: string, position: Vector3Tuple, target: Vector3Tuple) =>
        set((state) => ({
          pageSpecificCameras: {
            ...state.pageSpecificCameras,
            [page]: { position, target },
          },
        })),
      setIgnoreStoredCamera: (ignore: boolean) =>
        set({
          ignoreStoredCameraForCurrentPage: ignore,
        }),
      resetState: () =>
        set({
          cameraPosition: defaultPosition,
          cameraTarget: defaultTarget,
          sessionId: generateSessionId(),
          lastUpdated: Date.now(),
        }),
    }),
    {
      name: 'r3f-state',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        cameraPosition: state.cameraPosition,
        cameraTarget: state.cameraTarget,
        pageSpecificCameras: state.pageSpecificCameras,
        sessionId: state.sessionId,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

// Hook to get camera settings based on current page
export const usePageCamera = (pagePath: string) => {
  const { cameraPosition, cameraTarget, pageSpecificCameras, ignoreStoredCameraForCurrentPage } =
    useR3FStore();

  // Check if we have specific settings for this page
  if (pageSpecificCameras[pagePath]) {
    return pageSpecificCameras[pagePath];
  }

  // Use default camera settings if we should ignore stored state
  if (ignoreStoredCameraForCurrentPage) {
    return { position: defaultPosition, target: defaultTarget };
  }

  // Fall back to the shared camera state
  return { position: cameraPosition, target: cameraTarget };
};

// Create a hook to check for session validity and reset if needed
export const useSessionCheck = () => {
  const { sessionId, resetState } = useR3FStore();

  // Check if we need a new session (e.g., on first load)
  const storedSessionId = sessionStorage.getItem('current-session-id');

  if (!storedSessionId) {
    // First visit in this browser session, store the ID
    sessionStorage.setItem('current-session-id', sessionId);
  } else if (storedSessionId !== sessionId) {
    // We have a different session ID stored - user probably closed tab and came back
    sessionStorage.setItem('current-session-id', sessionId);
    // Reset the state to defaults
    resetState();
  }
};
