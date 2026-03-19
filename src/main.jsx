import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#12121a',
            color: '#e2e0ff',
            border: '1px solid #1e1e2e',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6c63ff', secondary: '#12121a' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#12121a' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
