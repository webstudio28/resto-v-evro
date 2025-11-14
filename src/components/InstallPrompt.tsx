import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('evrolev_install_dismissed')
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

    // Show prompt if not dismissed or dismissed more than 7 days ago
    if (!dismissed || daysSinceDismissed > 7) {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        setShowPrompt(true)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowPrompt(false)
      setDeferredPrompt(null)
    } else {
      // User dismissed, remember for 7 days
      localStorage.setItem('evrolev_install_dismissed', Date.now().toString())
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('evrolev_install_dismissed', Date.now().toString())
    setShowPrompt(false)
  }

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg p-4 flex items-center gap-3">
        <div className="flex-1">
          <div className="font-medium text-black dark:text-white text-sm mb-1">
            Инсталирайте Evrolev
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400">
            Добавете приложението към началния екран за по-бърз достъп
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-navy-600 dark:bg-navy-500 text-white px-3 py-1.5 text-sm font-medium hover:bg-navy-700 dark:hover:bg-navy-600 transition-colors"
          >
            Инсталирай
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

