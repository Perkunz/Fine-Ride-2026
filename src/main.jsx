import React from 'react'
import { createRoot } from 'react-dom/client'
import LandingApp from './landingcomponents.jsx'

// Mount the app
const rootEl = document.getElementById('root') || document.createElement('div')
if (!rootEl.id) document.body.appendChild(rootEl)
const root = createRoot(rootEl)
root.render(
  <React.StrictMode>
    <LandingApp />
  </React.StrictMode>
)
