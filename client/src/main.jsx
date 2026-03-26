import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 

// ⭐ Clean URL: Strip any "v=" cache-busting parameters from the address bar immediately
if (window.location.search.includes('v=')) {
    const params = new URLSearchParams(window.location.search);
    params.delete('v');
    const newSearch = params.toString();
    const newPath = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
    window.history.replaceState({}, document.title, newPath);
}

// Performance monitoring ko abhi ke liye hata dete hain taaki app load ho sake
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

