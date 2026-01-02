import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../assets/light-logo.png'
import darkLogo from '../assets/dark-logo.png'
import languageLight from '../assets/language-light.png'
import languageDark from '../assets/language-dark.png'

type Language = 'en' | 'bg'

const translations: Record<Language, { title: string; body: string; language: string }> = {
  bg: {
    title: 'Webstudio28',
    body: 'Тестова страница за /webstudio28',
    language: 'Език',
  },
  en: {
    title: 'Webstudio28',
    body: 'Test page for /webstudio28',
    language: 'Language',
  },
}

function useTheme(): [string, (t: 'light' | 'dark') => void] {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, (t) => setTheme(t)]
}

export function Webstudio28Page() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null
    return saved || 'bg'
  })
  const t = useMemo(() => translations[language], [language])
  const [theme] = useTheme()

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const isDark = theme === 'dark'

  return (
    <div
      className={`theme-transition min-h-screen ${
        isDark
          ? 'bg-[#0a0a0a] md:bg-[#0a0a0a]'
          : 'bg-white md:bg-gradient-to-b md:from-neutral-100 md:via-neutral-50 md:to-neutral-200'
      }`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 md:px-4 md:py-6 lg:py-10">
        <div className="flex flex-1 justify-center">
          <div
            className={`w-full max-w-[528px] md:rounded-xl md:border ${
              isDark
                ? 'md:border-neutral-800 md:bg-neutral-900 md:shadow-sm'
                : 'md:border-neutral-200 md:bg-white md:shadow-sm'
            }`}
          >
            <div className="p-4 md:p-5">
              <div
                className={`flex items-center justify-between mb-6 pb-4 rounded-lg ${
                  isDark ? 'bg-neutral-800' : 'bg-neutral-100'
                } px-4 pt-3 pb-2 -mx-4 md:-mx-5 md:px-3`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/app')}
                    aria-label="Back"
                    className="outline-none transition-opacity hover:opacity-80 active:opacity-60 text-black dark:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <img src={isDark ? lightLogo : darkLogo} alt="webstudi28" className="h-8" />
                </div>
                <div className="flex flex-row items-center gap-3">
                  <button
                    onClick={() => setLanguage(language === 'bg' ? 'en' : 'bg')}
                    aria-label={t.language}
                    className="outline-none transition-opacity hover:opacity-80 active:opacity-60"
                  >
                    <img
                      src={isDark ? languageDark : languageLight}
                      alt={t.language}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-black dark:text-white">{t.title}</h1>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{t.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


