import { useState, useEffect } from 'react'
import { App } from '../App'
import lightLogo from '../assets/light-logo.png'
import darkLogo from '../assets/dark-logo-landing.png'
import madeBy from '../assets/made-by.png'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )

export function LandingPage() {
  const [showApp, setShowApp] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowApp(true)
      return
    }

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

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

  const isDesktop = () => {
    return !isMobileDevice()
  }

  const handleDownload = async () => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // Already installed, just show the app
      setShowApp(true)
      return
    }

    // If install prompt is available, trigger it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        
        // Desktop behavior: open the web app after prompt interaction
        if (isDesktop()) {
          if (outcome === 'accepted' || outcome === 'dismissed') {
            setTimeout(() => {
              setShowApp(true)
            }, 500)
          }
        } else {
          // Mobile: if user dismissed, show manual instructions (Android)
          if (outcome === 'dismissed') {
            setShowAndroidInstructions(true)
          }
        }
        setDeferredPrompt(null)
      } catch (error) {
        console.error('Install prompt error:', error)
        if (isDesktop()) {
          setShowApp(true)
        } else {
          setShowAndroidInstructions(true)
        }
      }
    } else {
      // Check if iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      
      if (isIOS && isSafari) {
        // Show iOS instructions
        setShowIOSInstructions(true)
      } else if (isMobileDevice()) {
        // Show Android instructions when install prompt isn't available
        setShowAndroidInstructions(true)
      } else {
        // No install prompt available, show app only on desktop
        setShowApp(true)
      }
      // On mobile, stay on landing page if no install prompt or show instructions
    }
  }

  if (showApp) {
    return <App />
  }

  if (showIOSInstructions) {
    return (
      <div className="h-screen flex items-center justify-center px-4 bg-white dark:bg-black overflow-y-auto py-4" style={{ height: '100dvh' }}>
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-normal text-black dark:text-white">
              Как да инсталирате приложението
            </h2>
            <div className="text-black dark:text-white text-left space-y-3 border border-neutral-300 dark:border-neutral-700 p-6">
              <p>1. Натиснете бутона за споделяне □↑ в долната част на екрана</p>
              <p>2. Изберете "Добави към началния екран"</p>
              <p>3. Натиснете "Добави"</p>
            </div>
          </div>
          <button
            onClick={() => setShowApp(true)}
            className="w-full rounded-xl bg-white dark:bg-black border border-black dark:border-white px-8 py-4 text-base"
          >
            Продължи без инсталация
          </button>
        </div>
      </div>
    )
  }
  if (showAndroidInstructions) {
    return (
      <div className="h-screen flex items-center justify-center px-4 bg-white dark:bg-black overflow-y-auto py-4" style={{ height: '100dvh' }}>
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-normal text-black dark:text-white">
              Как да инсталирате приложението (Android)
            </h2>
            <div className="text-black dark:text-white text-left space-y-3 border border-neutral-300 dark:border-neutral-700 p-6">
              <p>1. Натиснете менюто ⋮ в горния десен ъгъл на Chrome</p>
              <p>2. Изберете „Добави към началния екран"</p>
              <p>3. Потвърдете с „Добави"</p>
            </div>
          </div>
          <button
            onClick={() => setShowApp(true)}
            className="w-full rounded-xl bg-white dark:bg-black border border-black dark:border-white px-8 py-4 text-base"
          >
            Продължи без инсталация
          </button>
        </div>
      </div>
    )
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
              onClick={() => setShowApp(true)}
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
    </div>
  )
}

