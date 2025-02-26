import App from './App';
import Test from './Test';
import { initR3F } from './r3fManager';

type SceneMap = {
  [key: string]: React.ComponentType;
};

// Map of page paths to their respective scene components
const sceneMap: SceneMap = {
  '/': App,
  '/page-2': Test,
};

class WebflowR3F {
  private initialized = false;
  private currentRoot: any = null;
  private instanceId = Math.random().toString(36).substring(2, 10);

  init() {
    if (this.initialized) return;
    this.initialized = true;

    console.log(`[WebflowR3F] Initializing instance ${this.instanceId}`);

    // Use Webflow's own event system for initialization
    window.Webflow ||= [];
    window.Webflow.push(() => {
      console.log('[WebflowR3F] Webflow ready, mounting initial scene');
      this.mountScene();

      // Handle page transitions - this is critical for Webflow
      window.addEventListener('beforeunload', () => {
        console.log('[WebflowR3F] Page unloading, cleaning up');
        this.unmountScene();
      });

      document.addEventListener('DOMContentLoaded', () => {
        console.log('[WebflowR3F] DOM ready, mounting scene');
        this.mountScene();
      });
    });
  }

  private mountScene() {
    const path = window.location.pathname;
    console.log(`[WebflowR3F] Mounting scene for path: ${path}`);

    const SceneComponent = sceneMap[path] || App;

    // Track state between mounts
    const props = {
      mountTimestamp: Date.now(),
      previousPath: sessionStorage.getItem('r3f-previous-path'),
    };

    // Save current path for tracking
    sessionStorage.setItem('r3f-previous-path', path);

    try {
      this.currentRoot = initR3F('root', SceneComponent, props);
    } catch (e) {
      console.error('[WebflowR3F] Error mounting scene:', e);
    }
  }

  private unmountScene() {
    console.log('[WebflowR3F] Unmounting scene');

    // Instead of just clearing innerHTML, properly unmount React
    if (this.currentRoot) {
      try {
        this.currentRoot.unmount();
      } catch (e) {
        console.error('[WebflowR3F] Error unmounting:', e);
      }
    }

    const container = document.getElementById('root');
    if (container) {
      container.innerHTML = '';
    }
  }
}

// Create and initialize instance
const webflowR3F = new WebflowR3F();
webflowR3F.init();
