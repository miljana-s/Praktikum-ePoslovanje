import React from 'react';
import ReactDOM from 'react-dom/client';
import Application from './components/Application/Application';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Application />
    </React.StrictMode>
  </BrowserRouter>
);

reportWebVitals(console.log);