import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './styles/global.css';
import App from './App';
import { loadRuntimeConfig } from './config/runtimeConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Loader() {
  return (
    <div style={{
      width: '100vw', height: '100vh', background: 'var(--background)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card">
        <div style={{ textAlign: 'center', fontSize: 20, color: 'var(--primary)' }}>Loading...</div>
      </div>
    </div>
  );
}

function Root() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadRuntimeConfig().then(() => setReady(true));
  }, []);

  return ready ? <App /> : <Loader />;
}

root.render(<Root />);
