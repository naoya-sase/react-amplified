import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import App from './App.tsx'
import '@aws-amplify/ui-react/styles.css';
import '@fontsource/inter';
import './index.css'

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
