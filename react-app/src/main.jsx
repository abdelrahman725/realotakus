import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <div className="footer">&copy; 2024 Abdelrahman, All rights reserved.</div>
    </BrowserRouter>
  </StrictMode>,
)
