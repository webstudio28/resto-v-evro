import { useState, useEffect } from 'react'
import { App } from '../App'

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

  const isDesktop = () => {
    return !isMobileDevice()
  }

  const handleDownload = async () => {
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-navy-600 to-navy-800 dark:from-navy-800 dark:to-navy-900">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Как да инсталирате приложението
            </h2>
            <div className="text-white/90 text-left space-y-3 bg-white/10 rounded-xl p-6 backdrop-blur">
              <p className="font-medium">1. Натиснете бутона за споделяне <span className="text-yellow-400">□↑</span> в долната част на екрана</p>
              <p className="font-medium">2. Изберете "Добави към началния екран"</p>
              <p className="font-medium">3. Натиснете "Добави"</p>
            </div>
          </div>
          <button
            onClick={() => setShowApp(true)}
            className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold px-8 py-4 text-lg transition-colors"
          >
            Продължи без инсталация
          </button>
        </div>
      </div>
    )
  }
  if (showAndroidInstructions) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-navy-600 to-navy-800 dark:from-navy-800 dark:to-navy-900">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Как да инсталирате приложението (Android)
            </h2>
            <div className="text-white/90 text-left space-y-3 bg-white/10 rounded-xl p-6 backdrop-blur">
              <p className="font-medium">1. Натиснете менюто ⋮ в горния десен ъгъл на Chrome</p>
              <p className="font-medium">2. Изберете „Добави към началния екран“</p>
              <p className="font-medium">3. Потвърдете с „Добави“</p>
            </div>
          </div>
          <button
            onClick={() => setShowApp(true)}
            className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold px-8 py-4 text-lg transition-colors"
          >
            Продължи без инсталация
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-navy-600 to-navy-800 dark:from-navy-800 dark:to-navy-900">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            webstudi28
          </h1>
          <p className="text-xl text-white/90">
            Малко приложение, което решава вашите големи проблеми с еврото
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold px-8 py-4 text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
        >
          Изтегли приложението
        </button>
        <button
          onClick={() => setShowApp(true)}
          className="w-full rounded-xl border border-white/40 text-white font-medium px-8 py-3 text-base transition-colors hover:bg-white/10"
        >
          Продължи без инсталация
        </button>

        <p className="text-sm text-white/70">
          Безплатно и без регистрация
        </p>
      </div>
    </div>
  )
}

