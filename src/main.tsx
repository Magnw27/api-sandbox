import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import Sandbox from './Sandbox'

const isSandbox = window.location.pathname.replace(/\/$/, '') === '/sandbox'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    {isSandbox ? <Sandbox /> : <App />}
  </StrictMode>,
)

if (!isSandbox) {
  window.setTimeout(() => {
    const button = [...document.querySelectorAll('button')].find((item) => item.textContent?.includes('Enter the sandbox'))
    button?.addEventListener('click', () => { window.location.href = '/sandbox' }, { capture: true })
  }, 0)
}
