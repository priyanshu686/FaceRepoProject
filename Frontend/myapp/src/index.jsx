import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import { loadModels } from './utils/face_detect.js';
const App = lazy(() => import('./App.jsx'));

const root = ReactDOM.createRoot(document.getElementById('root'));

const loadFace = async () => {
    const func = () => {
    };
    await loadModels(func);
    return true;
}

root.render(
  <React.StrictMode>
        <Router>
            { loadFace() &&
                <Suspense fallback={<div id="Loader"><div className="child"></div></div>}>
                    <App />
                </Suspense>
            }
        </Router>
  </React.StrictMode>
);