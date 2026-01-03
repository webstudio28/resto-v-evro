import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { LandingPage } from './components/LandingPage.tsx'
import { NativeLandingPage } from './components/NativeLandingPage.tsx'
import { App } from './App.tsx'
import { PrivacyPolicy } from './components/PrivacyPolicy.tsx'
import { setupServiceWorkerUpdates } from './lib/sw-update.ts'
import { isNativePlatform } from './lib/platform.ts'

// Lazy-load the ad/lead page so its carousel + images don't impact the calculator bundle.
const Webstudio28Page = lazy(async () => {
  const mod = await import('./components/Webstudio28Page.tsx')
  return { default: mod.Webstudio28Page }
})

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
        <Route
          path="/webstudio28"
          element={
            <Suspense fallback={null}>
              <Webstudio28Page />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

