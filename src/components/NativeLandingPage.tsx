import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../assets/light-logo.png'
import darkLogo from '../assets/dark-logo-landing.png'
import madeBy from '../assets/made-by.png'

export function NativeLandingPage() {
  const navigate = useNavigate()
  const [showProblemsModal, setShowProblemsModal] = useState(false)
  const [isDark, setIsDark] = useState(false)

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

  const handleContinue = () => {
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
             Бързо изчисляване на рестото при плащане в лева и евро.
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
              onClick={handleContinue}
              className=" rounded-3xl bg-black dark:bg-white text-white dark:text-black px-10 py-3 text-sm"
            >
              Използвай сега
            </button>
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

      {/* Problems Modal */}
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
    </div>
  )
}

