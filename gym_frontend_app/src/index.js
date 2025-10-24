import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import { loadRuntimeConfig } from './config/runtimeConfig';
import { AuthProvider } from './context';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in document.');
}
const root = ReactDOM.createRoot(rootEl);

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

  // Ensure AuthProvider wraps the whole app tree so all routes/pages can use the auth context.
  return ready ? (
    <AuthProvider>
      <App />
    </AuthProvider>
  ) : <Loader />;
}

root.render(<Root />);
