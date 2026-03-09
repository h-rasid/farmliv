import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './index.css';

// Performance monitoring ko abhi ke liye hata dete hain taaki app load ho sake
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);