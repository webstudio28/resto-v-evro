import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../assets/light-logo.png'
import darkLogo from '../assets/dark-logo-landing.png'
import madeBy from '../assets/made-by.png'
import { IOSModal } from './IOSModal'
import { AndroidSuccessModal } from './AndroidSuccessModal'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Store deferred prompt globally so it persists across navigation
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null

export function LandingPage() {
  const navigate = useNavigate()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [showAndroidSuccessModal, setShowAndroidSuccessModal] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Check if already installed
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    if (isStandalone) {
      // Check if we just installed (stored in sessionStorage)
      const justInstalled = sessionStorage.getItem('justInstalled') === 'true'
      
      if (justInstalled) {
        // Show success modal and clear the flag
        setShowAndroidSuccessModal(true)
        sessionStorage.removeItem('justInstalled')
      } else {
        // Already installed, redirect to app
        const currentPath = window.location.pathname
        if (currentPath === '/' || currentPath === '') {
          navigate('/app', { replace: true })
        }
      }
    }
  }, [navigate])

  useEffect(() => {
    // Check if we already have a stored prompt
    if (globalDeferredPrompt && !deferredPrompt) {
      setDeferredPrompt(globalDeferredPrompt)
    }

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      globalDeferredPrompt = promptEvent
      setDeferredPrompt(promptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [deferredPrompt])

  useEffect(() => {
    // Detect dark mode
    const checkDarkMode = () => {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      const hasDarkClass = document.documentElement.classList.contains('dark')
      setIsDark(prefersDark || hasDarkClass)
    }

    checkDarkMode()

    // Listen for theme changes
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      // Fallback for older browsers
      mql.addListener(handler)
      return () => mql.removeListener(handler)
    }
  }, [])

  const handleDownload = async () => {
    // Check if iOS (any browser on iOS)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    if (isIOS) {
      // Show iOS modal
      setShowIOSModal(true)
      return
    }

    // If install prompt is available (Android/Desktop), trigger it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        
        // Clear the prompt after use (it can only be used once)
        globalDeferredPrompt = null
        setDeferredPrompt(null)
        
        if (outcome === 'accepted') {
          // Installation accepted - store flag and show success modal
          // The flag helps detect installation even if page reloads
          sessionStorage.setItem('justInstalled', 'true')
          setShowAndroidSuccessModal(true)
        }
        // If dismissed, user stays on landing page (no modal)
      } catch (error) {
        console.error('Install prompt error:', error)
        // Clear on error too
        globalDeferredPrompt = null
        setDeferredPrompt(null)
      }
    } else {
      // No install prompt available
      // On mobile (Android without prompt), stay on landing page
      // On desktop, user can install from browser menu, so stay on landing page too
      // Don't auto-navigate to app
    }
  }

  const handleContinueWithoutInstall = () => {
    navigate('/app')
  }


  return (
    <div className="h-screen flex flex-col overflow-y-auto px-4 bg-white dark:bg-black relative" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 pointer-events-none bg-blue-500/20 dark:bg-blue-950/20" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
      <div className="pt-20 pb-8 relative z-10 flex-shrink-0">
        <img
          src={isDark ? lightLogo : darkLogo}
          alt="webstudi28"
          className="h-12 mx-auto"
        />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 min-h-0 py-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xl text-black dark:text-white">
              Бързо изчисляване на рестото при плащане в лева и евро
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-base"
            >
              Изтегли приложението
            </button>
            <button
              onClick={handleContinueWithoutInstall}
              className="w-full rounded-xl bg-white dark:bg-black border border-neutral-400 dark:border-neutral-600 px-8 py-3 text-base"
            >
              Продължи без инсталация
            </button>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 pt-2">
              Безплатно и без регистрация
            </p>
          </div>
        </div>
      </div>

      <div className="py-8 relative z-10 flex-shrink-0">
        <a
          href="https://www.webstudio28.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={madeBy}
            alt="Made by webstudio28"
            className="h-12 mx-auto"
          />
        </a>
      </div>

      {/* Modals */}
      <IOSModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
        onContinue={handleContinueWithoutInstall}
      />
      <AndroidSuccessModal
        isOpen={showAndroidSuccessModal}
        onClose={() => setShowAndroidSuccessModal(false)}
        appName="resto26"
      />
    </div>
  )
}

