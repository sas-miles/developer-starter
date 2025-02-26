import { createRoot } from 'react-dom/client';
import App from './App';

window.Webflow ||= [];
window.Webflow.push(() => {
  const root = createRoot(document.getElementById('root') as HTMLElement);
  root.render(<App />);
});
