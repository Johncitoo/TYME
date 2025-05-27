import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'          // ¡Aquí va TODO Tu CSS!
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
