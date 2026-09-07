import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import Sandbox from './Sandbox'

const isSandbox = window.location.pathname.replace(/\/$/, '') === '/sandbox'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSandbox ? <Sandbox /> : <App />}
  </StrictMode>,
)
