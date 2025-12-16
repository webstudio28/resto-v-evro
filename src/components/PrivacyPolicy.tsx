import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../assets/light-logo.png'
import darkLogo from '../assets/dark-logo.png'
import languageLight from '../assets/language-light.png'
import languageDark from '../assets/language-dark.png'

type Language = 'en' | 'bg'

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated',
    introduction: 'Introduction',
    dataCollection: 'Data Collection',
    dataUsage: 'How We Use Your Data',
    dataStorage: 'Data Storage',
    dataSharing: 'Data Sharing',
    yourRights: 'Your Rights',
    childrenPrivacy: 'Children\'s Privacy',
    changes: 'Changes to This Privacy Policy',
    contact: 'Contact Us',
    language: 'Language',
  },
  bg: {
    title: 'Политика за поверителност',
    lastUpdated: 'Последна актуализация',
    introduction: 'Въведение',
    dataCollection: 'Събиране на данни',
    dataUsage: 'Как използваме вашите данни',
    dataStorage: 'Съхранение на данни',
    dataSharing: 'Споделяне на данни',
    yourRights: 'Вашите права',
    childrenPrivacy: 'Поверителност на децата',
    changes: 'Промени в тази политика за поверителност',
    contact: 'Свържете се с нас',
    language: 'Език',
  },
}

const privacyContent: Record<Language, { sections: Array<{ title: string; content: string[] }> }> = {
  en: {
    sections: [
      {
        title: 'Introduction',
        content: [
          'This Privacy Policy explains how resto26 ("we", "our", or "us") collects, uses, and protects your information when you use our mobile application and web service (collectively, the "Service").',
          'We are committed to protecting your privacy and ensuring transparency about our data practices. This policy applies to all users of our Service.',
        ],
      },
      {
        title: 'Data Collection',
        content: [
          'resto26 is designed to be a privacy-focused application. We do not collect, store, or transmit any personal information, user data, or sensitive information.',
          'The application operates entirely offline and all calculations are performed locally on your device. No data is sent to external servers.',
          'We do not use analytics, tracking tools, advertising networks, or any third-party services that would collect information about you.',
          'The application does not require registration, accounts, or any form of user identification.',
        ],
      },
      {
        title: 'How We Use Your Data',
        content: [
          'Since we do not collect any personal data, there is no data to use, share, or sell.',
          'All calculations and operations occur locally on your device using the fixed exchange rate of 1 EUR = 1.95583 BGN.',
        ],
      },
      {
        title: 'Data Storage',
        content: [
          'No data is stored on external servers. All application data remains on your device.',
          'The application may use local browser storage or device storage for caching purposes to improve performance, but this does not contain any personal information.',
        ],
      },
      {
        title: 'Data Sharing',
        content: [
          'We do not share, sell, or disclose any personal information because we do not collect any.',
          'The application does not connect to external services, APIs, or servers that would require data transmission.',
        ],
      },
      {
        title: 'Your Rights',
        content: [
          'Since we do not collect personal data, there is no data to access, modify, or delete.',
          'You have full control over the application and can uninstall it at any time without leaving any trace of personal information on our servers (because we do not have any servers collecting your data).',
        ],
      },
      {
        title: 'Children\'s Privacy',
        content: [
          'Our Service is suitable for users of all ages, including children under the age of 13.',
          'We do not knowingly collect personal information from anyone, including children.',
          'Since our application does not collect any data, there are no additional privacy concerns for children using the Service.',
        ],
      },
      {
        title: 'Changes to This Privacy Policy',
        content: [
          'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.',
          'We encourage you to review this Privacy Policy periodically for any changes.',
        ],
      },
      {
        title: 'Contact Us',
        content: [
          'If you have any questions about this Privacy Policy, please contact us at:',
          'Email: bgwebstudio28@gmail.com',
          'Website: https://www.webstudio28.com',
        ],
      },
    ],
  },
  bg: {
    sections: [
      {
        title: 'Въведение',
        content: [
          'Тази Политика за поверителност обяснява как resto26 ("ние", "нашето" или "нас") събира, използва и защитава вашата информация, когато използвате нашето мобилно приложение и уеб услуга (наричани заедно "Услугата").',
          'Ние сме ангажирани да защитаваме вашата поверителност и да осигурим прозрачност относно нашите практики за данни. Тази политика се прилага за всички потребители на нашата Услуга.',
        ],
      },
      {
        title: 'Събиране на данни',
        content: [
          'resto26 е проектирано като приложение, фокусирано върху поверителността. Ние не събираме, съхраняваме или предаваме лична информация, потребителски данни или чувствителна информация.',
          'Приложението работи изцяло офлайн и всички изчисления се извършват локално на вашето устройство. Никакви данни не се изпращат към външни сървъри.',
          'Ние не използваме аналитика, инструменти за проследяване, рекламни мрежи или каквито и да било услуги на трети страни, които биха събрали информация за вас.',
          'Приложението не изисква регистрация, акаунти или каквато и да е форма за идентификация на потребителя.',
        ],
      },
      {
        title: 'Как използваме вашите данни',
        content: [
          'Тъй като не събираме лични данни, няма данни за използване, споделяне или продажба.',
          'Всички изчисления и операции се извършват локално на вашето устройство, използвайки фиксирания обменен курс от 1 EUR = 1.95583 BGN.',
        ],
      },
      {
        title: 'Съхранение на данни',
        content: [
          'Никакви данни не се съхраняват на външни сървъри. Всички данни на приложението остават на вашето устройство.',
          'Приложението може да използва локално браузърно хранилище или хранилище на устройството за целите на кеширане, за да подобри производителността, но това не съдържа лична информация.',
        ],
      },
      {
        title: 'Споделяне на данни',
        content: [
          'Ние не споделяме, продаваме или разкриваме лична информация, защото не събираме такава.',
          'Приложението не се свързва с външни услуги, API или сървъри, които биха изисквали предаване на данни.',
        ],
      },
      {
        title: 'Вашите права',
        content: [
          'Тъй като не събираме лични данни, няма данни за достъп, модифициране или изтриване.',
          'Вие имате пълен контрол върху приложението и можете да го деинсталирате по всяко време, без да оставите следа от лична информация на нашите сървъри (защото нямаме сървъри, които събират вашите данни).',
        ],
      },
      {
        title: 'Поверителност на децата',
        content: [
          'Нашата Услуга е подходяща за потребители от всички възрасти, включително деца под 13-годишна възраст.',
          'Ние не събираме умишлено лична информация от никого, включително деца.',
          'Тъй като нашето приложение не събира никакви данни, няма допълнителни проблеми с поверителността за деца, които използват Услугата.',
        ],
      },
      {
        title: 'Промени в тази политика за поверителност',
        content: [
          'Може да актуализираме тази Политика за поверителност от време на време. Всички промени ще бъдат публикувани на тази страница с актуализирана дата на "Последна актуализация".',
          'Насърчаваме ви да преглеждате тази Политика за поверителност периодично за всякакви промени.',
        ],
      },
      {
        title: 'Свържете се с нас',
        content: [
          'Ако имате въпроси относно тази Политика за поверителност, моля, свържете се с нас на:',
          'Имейл: bgwebstudio28@gmail.com',
          'Уебсайт: https://www.webstudio28.com',
        ],
      },
    ],
  },
}

function useTheme(): [string, (t: 'light' | 'dark') => void] {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    return 'light' // Always default to light mode
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, (t) => setTheme(t)]
}

export function PrivacyPolicy() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null
    return saved || 'bg'
  })
  const t = useMemo(() => translations[language], [language])
  const content = useMemo(() => privacyContent[language], [language])
  const [theme] = useTheme()

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const isDark = theme === 'dark'
  const lastUpdatedDate = 'December 2024'

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
              {/* Header */}
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
                  <img
                    src={isDark ? lightLogo : darkLogo}
                    alt="webstudi28"
                    className="h-8"
                  />
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

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h1
                    className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-black'
                    }`}
                  >
                    {t.title}
                  </h1>
                  <p
                    className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                  >
                    {t.lastUpdated}: {lastUpdatedDate}
                  </p>
                </div>

                <div className="space-y-6">
                  {content.sections.map((section, index) => (
                    <div key={index} className="space-y-3">
                      <h2
                        className={`text-lg font-semibold ${
                          isDark ? 'text-white' : 'text-black'
                        }`}
                      >
                        {section.title}
                      </h2>
                      <div className="space-y-2">
                        {section.content.map((paragraph, pIndex) => (
                          <p
                            key={pIndex}
                            className={`text-sm leading-relaxed ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <p
                    className={`text-xs text-center ${
                      isDark ? 'text-neutral-500' : 'text-neutral-500'
                    }`}
                  >
                    © 2024 resto26. {language === 'bg' ? 'Всички права запазени.' : 'All rights reserved.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

