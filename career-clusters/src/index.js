/* 
Entry point of the React Application, rendering the root components
LAST EDITED 04/05/2024 Gavin T. Anderson
*/

// Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root React DOM container
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the root component with a strict mode wrapper */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
