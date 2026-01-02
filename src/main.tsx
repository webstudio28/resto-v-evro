import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { LandingPage } from './components/LandingPage.tsx'
import { NativeLandingPage } from './components/NativeLandingPage.tsx'
import { App } from './App.tsx'
import { PrivacyPolicy } from './components/PrivacyPolicy.tsx'
import { Webstudio28Page } from './components/Webstudio28Page.tsx'
import { setupServiceWorkerUpdates } from './lib/sw-update.ts'
import { isNativePlatform } from './lib/platform.ts'

// Only enable service worker for web version (not native apps)
if (!isNativePlatform()) {
  setupServiceWorkerUpdates()
}

// Choose landing page based on platform
const LandingPageComponent = isNativePlatform() ? NativeLandingPage : LandingPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageComponent />} />
        <Route path="/app" element={<App />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/webstudio28" element={<Webstudio28Page />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

