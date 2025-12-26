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
  const [showProblemsModal, setShowProblemsModal] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Check if already installed on initial load
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
        // Already installed - if on landing page, redirect to app
        // (Don't show modal on initial load if already installed)
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
    // Check if theme is saved in localStorage or dark class exists
    const savedTheme = localStorage.getItem('theme')
    const hasDarkClass = document.documentElement.classList.contains('dark')
    setIsDark(savedTheme === 'dark' || hasDarkClass)
  }, [])

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  }

  // Temporarily commented out - part of original logic
  /*
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  const isMacOS = () => {
    return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent)
  }
  */

  const handleDownload = async () => {
    // TEMPORARY: Show coming soon modal for all devices
    setShowComingSoonModal(true)
    return

    // ORIGINAL LOGIC - commented out temporarily until fix is found
    /*
    // Check if iOS or macOS - show "not available" message
    if (isIOS() || isMacOS()) {
      setShowIOSModal(true)
      return
    }

    // Always check if already installed first (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      // Already installed - show success modal with appropriate device message
      setShowAndroidSuccessModal(true)
      return
    }

    // Not installed - check if we have a prompt (check both state and global)
    const promptToUse = deferredPrompt || globalDeferredPrompt
    
    if (promptToUse) {
      // Restore to state if needed
      if (!deferredPrompt && globalDeferredPrompt) {
        setDeferredPrompt(globalDeferredPrompt)
      }
      
      try {
        await promptToUse.prompt()
        const { outcome } = await promptToUse.userChoice
        
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
        // Check if maybe it got installed despite the error
        setTimeout(() => {
          const checkStandalone = window.matchMedia('(display-mode: standalone)').matches
          if (checkStandalone) {
            setShowAndroidSuccessModal(true)
          }
        }, 500)
      }
    } else {
      // No install prompt available - but button should still work
      // Check if maybe it got installed in another tab/window
      const checkStandalone = window.matchMedia('(display-mode: standalone)').matches
      if (checkStandalone) {
        setShowAndroidSuccessModal(true)
      } else {
        // No prompt available - show success modal anyway
        // This ensures button always provides feedback
        // The modal will show "already installed" message which is appropriate
        // User can install manually from browser menu if needed
        setShowAndroidSuccessModal(true)
      }
    }
    */
  }

  const handleContinueWithoutInstall = () => {
    navigate('/app')
  }


  return (
    <div className="h-screen flex flex-col overflow-y-auto px-4 bg-white dark:bg-black relative" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 pointer-events-none bg-blue-500/20 dark:bg-blue-950/20" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>

      <div className="flex-1 flex items-center justify-center relative z-10 min-h-0">
        <div className="max-w-md w-full text-center space-y-0">
          <img
            src={isDark ? lightLogo : darkLogo}
            alt="webstudi28"
            className="h-12 mx-auto"
          />
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-white px-4">
             Бързо изчисляване на рестото при плащане в лева и евро
            </p>
            <button
              onClick={() => setShowProblemsModal(true)}
              className="text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline underline-offset-2"
            >
              Какви проблеми решава
            </button>
          </div>

          <div className="space-y-3 pt-8">
            <button
              onClick={handleContinueWithoutInstall}
              className=" rounded-3xl bg-black dark:bg-white text-white dark:text-black px-10 py-3 text-sm"
            >
              Използвай!
            </button>
          </div>
        </div>
      </div>

      <div className="py-8 relative z-10 flex-shrink-0 space-y-4">
        <button
          onClick={handleDownload}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 px-4 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-black transition-colors mx-auto block hidden"
        >
          Изтегли приложението
        </button>
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
        isMobile={isMobileDevice()}
      />
      {showProblemsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowProblemsModal(false)}
        >
          <div
            className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 max-w-md w-full p-6 space-y-4 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-black dark:text-white">
                Автоматично пресмятане на:
              </h3>
              <ul className="space-y-2 text-sm text-black dark:text-white">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Плащане в лева, но рестото е в евро</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Плащане комбинирано от лева и евро, но рестото е в евро</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>В касата няма достатъчно евро, затова рестото е в лева</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowProblemsModal(false)}
              className="w-full rounded-xl bg-white dark:bg-black border border-neutral-400 dark:border-neutral-600 px-8 py-3 text-base"
            >
              Затвори
            </button>
          </div>
        </div>
      )}
      {showComingSoonModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowComingSoonModal(false)}
        >
          <div
            className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 max-w-md w-full p-6 space-y-4 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <p className="text-base text-black dark:text-white text-center">
                Очаквайте приложението скоро за Android и IOS
              </p>
            </div>
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full rounded-xl bg-white dark:bg-black border border-neutral-400 dark:border-neutral-600 px-8 py-3 text-base"
            >
              Затвори
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


