// main.ts - Entry point for Webflow integration
import { WebflowR3F } from './r3fManager';
import MainScene from './scenes/MainScene';
import SubScene from './scenes/SubScene';
import CustomCameraScene from './scenes/CustomCamera';
// Create scene map
const sceneMap = {
  '/': MainScene,
  '/page-2': SubScene,
  '/page-3': CustomCameraScene,
};

// Initialize
const webflowR3F = new WebflowR3F(sceneMap);
webflowR3F.init();

// Optional: Make resetState available globally for Webflow interactions
(window as any).resetR3FState = () => webflowR3F.resetState();
