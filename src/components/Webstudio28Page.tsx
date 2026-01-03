import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../assets/light-logo.png'
import darkLogo from '../assets/dark-logo.png'
import languageLight from '../assets/language-light.png'
import languageDark from '../assets/language-dark.png'
import web1 from '../assets/web-1.png'
import web2 from '../assets/web-2.png'
import web3 from '../assets/web-3.png'
import web4 from '../assets/web-4.png'
import web5 from '../assets/web-5.png'
import landingBg from '../assets/landing-bg.png'

type Language = 'en' | 'bg'

const translations: Record<Language, Record<string, string>> = {
  en: {
    heroTitle: 'Have a business, but your website doesn\'t bring clients?',
    heroSubtitle: 'We create websites that attract inquiries, build trust, and support your growth.',
    cta: 'Free consultation',
    section1Title: 'What we solve',
    section1Text: 'Most websites look good but don\'t bring results. We do it differently:',
    section1Bullet1: 'Clear message clients understand in seconds',
    section1Bullet2: 'Structure focused on inquiries and sales',
    section1Bullet3: 'Fast, secure, and SEO-optimized site',
    section1Bullet4: 'Individual solution according to your business model',
    section1Bullet5: 'Your site starts working for you, not just existing.',
    viewProjects: 'Our projects',
    learnMore: 'More about us',
    section2Title: 'Start with a consultation',
    section2Text: 'Start with a short, free consultation. We\'ll review your business and tell you what you really need.',
    projectsTitle: 'Some of our projects',
    language: 'Language',
    useApp: 'Use calculator',
    formTitle: 'Request a consultation',
    formFullName: 'Full name',
    formPhone: 'Phone',
    formEmail: 'Email',
    formDescription: 'Brief description of your business or idea',
    formSubmit: 'Send',
    formNote: 'We will contact you within 24 hours',
    formSuccess: "Your message was sent successfully. We'll contact you.",
    formBackToApp: 'Back to calculator',
  },
  bg: {
    heroTitle: 'Имате бизнес, но сайтът ви не носи клиенти?',
    heroSubtitle: 'Ние създаваме сайтове, които привличат запитвания, изграждат доверие и подкрепят растежа ви.',
    cta: 'Безплатна консултация',
    section1Title: 'Какво решаваме',
    section1Text: 'Повечето сайтове изглеждат добре, но не носят резултати. Ние го правим различно:',
    section1Bullet1: 'Ясно послание, което клиентът разбира за секунди',
    section1Bullet2: 'Структура, фокусирана върху запитвания и продажби',
    section1Bullet3: 'Бърз, сигурен и SEO-оптимизиран сайт',
    section1Bullet4: 'Индивидуално решение според вашия бизнес модел',
    section1Bullet5: 'Сайтът ви започва да работи за вас, не просто да съществува.',
    viewProjects: 'Нашите проекти',
    learnMore: 'Повече за нас',
    section2Title: 'Започнете с консултация',
    section2Text: 'Започнете с кратка, безплатна консултация. Ще разгледаме бизнеса ви и ще ви кажем какво реално ви трябва.',
    projectsTitle: 'Някои от нашите проекти',
    language: 'Език',
    useApp: 'Използвай калкулатор',
    formTitle: 'Заявка за консултация',
    formFullName: 'Пълно име',
    formPhone: 'Телефон',
    formEmail: 'Имейл',
    formDescription: 'Описание на бизнеса или идеята с няколко думи',
    formSubmit: 'Изпрати',
    formNote: 'Очаквайте да се свържем с вас до 24 часа',
    formSuccess: 'Вашето съобщение е изпратено успешно. Ще се свържем с вас.',
    formBackToApp: 'Обратно към калкулатора',
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
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [portfolioIndex, setPortfolioIndex] = useState(0)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    description: '',
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [projectsIdx, setProjectsIdx] = useState(0)

  const resetFormUi = () => {
    setFormSubmitting(false)
    setFormError(null)
    setFormSuccess(false)
    setFormData({ fullName: '', phone: '', email: '', description: '' })
  }

  const openFormModal = () => {
    resetFormUi()
    setShowFormModal(true)
  }

  const closeFormModal = () => {
    setShowFormModal(false)
    resetFormUi()
  }

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const isDark = theme === 'dark'

  const portfolioImages = [web1, web2, web3, web4, web5]

  return (
    <div
      className={`theme-transition min-h-screen ${
        isDark
          ? 'bg-[#0a0a0a] md:bg-[#0a0a0a]'
          : 'bg-white md:bg-gradient-to-b md:from-neutral-100 md:via-neutral-50 md:to-neutral-200'
      }`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col  py-4 md:px-4 md:py-6 lg:py-10">
        <div className="flex flex-1 justify-center">
          <div
            className={`w-full max-w-[528px] md:rounded-xl md:border ${
              isDark
                ? 'md:border-neutral-800 md:bg-neutral-900 md:shadow-sm'
                : 'md:border-neutral-200 md:bg-white md:shadow-sm'
            }`}
          >
            <div className="p-4 md:p-5">
              <div className={`flex items-center justify-between mb-4 pb-4 rounded-lg ${
                isDark ? 'bg-neutral-800' : 'bg-neutral-100'
              } px-4 pt-3 pb-2 -mx-4 md:-mx-5 md:px-3`}>
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

              {/* Hero Section */}
              <section className="mb-8 rounded-xl overflow-hidden">
                {/* Hero Image */}
                <div
                  className="relative w-full h-[40vh] md:h-[50vh]"
                  style={{
                    backgroundImage: `url(${landingBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Dark overlay */}

                </div>

                {/* Hero Text and CTA */}
                <div className={`${isDark ? 'bg-neutral-800' : 'bg-neutral-50'} px-4 md:px-6 py-8 rounded-b-xl`}>
                  <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h1 className="text-lg md:text-2xl font-bold text-black dark:text-white leading-tight">
                      {t.heroSubtitle}
                    </h1>
                    <button
                      onClick={openFormModal}
                      className="rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-base font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t.cta}
                    </button>
                  </div>
                </div>
              </section>

              {/* Section 1: What we offer */}
              <section className={`px-4 md:px-6 py-8 mb-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'} p-6`}>
                <div className="text-center space-y-6">
                  <h2 className={`text-2xl md:text-3xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                    {t.section1Title}
                  </h2>
                  <p className={`text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'} max-w-2xl mx-auto`}>
                    {t.section1Text}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto pt-4">
                    <div className={`rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-white'} p-4 text-left flex items-start gap-3`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-white' : 'text-black'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <p className={`text-sm md:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {t.section1Bullet1}
                      </p>
                    </div>
                    <div className={`rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-white'} p-4 text-left flex items-start gap-3`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-white' : 'text-black'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <p className={`text-sm md:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {t.section1Bullet2}
                      </p>
                    </div>
                    <div className={`rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-white'} p-4 text-left flex items-start gap-3`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-white' : 'text-black'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <p className={`text-sm md:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {t.section1Bullet3}
                      </p>
                    </div>
                    <div className={`rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-white'} p-4 text-left flex items-start gap-3`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-white' : 'text-black'}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <p className={`text-sm md:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {t.section1Bullet4}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                    <button
                      onClick={() => setShowPortfolioModal(true)}
                      className="rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-base font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
                    >
                      {t.viewProjects}
                    </button>
                    <button
                      onClick={() => window.open('https://www.webstudio28.com/about/', '_blank')}
                      className="rounded-xl border border-neutral-400 dark:border-neutral-600 bg-transparent text-black dark:text-white px-8 py-3 text-base font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
                    >
                      {t.learnMore}
                    </button>
                  </div>
                </div>
              </section>

              {/* Projects carousel (loads only on this page) */}
              <section className={`px-4 md:px-6 py-8 mb-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'} p-6`}>
                <div className="space-y-4">
                  <h2 className={`text-xl md:text-2xl font-semibold text-center ${isDark ? 'text-white' : 'text-black'}`}>
                    {t.projectsTitle}
                  </h2>

                  <div className={`relative rounded-xl overflow-hidden border ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        const next = projectsIdx === 0 ? portfolioImages.length - 1 : projectsIdx - 1
                        setProjectsIdx(next)
                      }}
                      aria-label="Previous project"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 text-white p-2 hover:opacity-90 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const next = projectsIdx === portfolioImages.length - 1 ? 0 : projectsIdx + 1
                        setProjectsIdx(next)
                      }}
                      aria-label="Next project"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 text-white p-2 hover:opacity-90 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPortfolioIndex(projectsIdx)
                        setShowPortfolioModal(true)
                      }}
                      className="block w-full"
                      aria-label="Open project gallery"
                    >
                      <img
                        src={portfolioImages[projectsIdx]}
                        alt={`Project ${projectsIdx + 1}`}
                        className="w-full h-[220px] md:h-[260px] object-cover"
                        loading="lazy"
                      />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {portfolioImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProjectsIdx(idx)}
                          aria-label={`Go to project ${idx + 1}`}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === projectsIdx ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Let's talk */}
              <section className={`px-4 md:px-6 py-8 mb-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-neutral-50'} p-6`}>
                <div className="text-center space-y-6">
                  <h2 className={`text-2xl md:text-3xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                    {t.section2Title}
                  </h2>
                  <p className={`text-base md:text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'} max-w-2xl mx-auto`}>
                    {t.section2Text}
                  </p>
                    <button
                      onClick={openFormModal}
                      className="rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-base font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t.cta}
                    </button>
                </div>
              </section>

              {/* Footer: Link to calculator */}
              <div className={`pt-6 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div className="text-center">
                  <button
                    onClick={() => navigate('/app')}
                    className={`text-sm ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-900'} transition-colors`}
                  >
                    {t.useApp}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setShowPortfolioModal(false)}
        >
          <div
            className={`relative max-w-4xl w-full rounded-xl overflow-hidden ${isDark ? 'bg-neutral-900' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowPortfolioModal(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 dark:bg-white/50 text-white dark:text-black p-2 hover:opacity-80 transition-opacity"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image carousel */}
            <div className="relative">
              <img
                src={portfolioImages[portfolioIndex]}
                alt={`Project ${portfolioIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Navigation arrows */}
              {portfolioImages.length > 1 && (
                <>
                  <button
                    onClick={() => setPortfolioIndex((prev) => (prev === 0 ? portfolioImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 dark:bg-white/50 text-white dark:text-black p-2 hover:opacity-80 transition-opacity"
                    aria-label="Previous"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPortfolioIndex((prev) => (prev === portfolioImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 dark:bg-white/50 text-white dark:text-black p-2 hover:opacity-80 transition-opacity"
                    aria-label="Next"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots indicator */}
              {portfolioImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {portfolioImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPortfolioIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === portfolioIndex
                          ? 'bg-black dark:bg-white'
                          : 'bg-neutral-400 dark:bg-neutral-600'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consultation Form Modal */}
      {showFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-4"
          onClick={closeFormModal}
        >
          <div
            className={`relative max-w-md w-full max-h-[90vh] rounded-xl overflow-hidden flex flex-col ${isDark ? 'bg-neutral-900' : 'bg-white'} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => {
                closeFormModal()
              }}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 dark:bg-white/50 text-white dark:text-black p-2 hover:opacity-80 transition-opacity"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                {!formSuccess ? (
                  <>
                    <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
                      {t.formTitle}
                    </h2>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        if (formSubmitting) return
                        setFormSubmitting(true)
                        setFormError(null)

                        try {
                          const resp = await fetch('/api/contact', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              fullName: formData.fullName,
                              phone: formData.phone,
                              email: formData.email,
                              description: formData.description,
                              page: '/webstudio28',
                              language,
                            }),
                          })

                          const data = (await resp.json().catch(() => null)) as
                            | { ok: true; id?: string }
                            | { ok: false; error?: string }
                            | null

                          if (!resp.ok || !data || data.ok !== true) {
                            const msg =
                              (data && 'error' in data && data.error) ||
                              (language === 'bg'
                                ? 'Грешка при изпращане. Опитайте отново.'
                                : 'Failed to send. Please try again.')
                            setFormError(msg)
                            return
                          }

                          setFormSuccess(true)
                        } catch {
                          setFormError(
                            language === 'bg'
                              ? 'Грешка при изпращане. Опитайте отново.'
                              : 'Failed to send. Please try again.',
                          )
                        } finally {
                          setFormSubmitting(false)
                        }
                      }}
                      className="space-y-4"
                      autoComplete="on"
                    >
                  <div>
                    <label
                      htmlFor="ws28_fullName"
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
                    >
                      {t.formFullName}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="ws28_fullName"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-black'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
                      placeholder={t.formFullName}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ws28_phone"
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
                    >
                      {t.formPhone}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="ws28_phone"
                      name="tel"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-black'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
                      placeholder={t.formPhone}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ws28_email"
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
                    >
                      {t.formEmail}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="ws28_email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-black'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
                      placeholder={t.formEmail}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ws28_description"
                      className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
                    >
                      {t.formDescription}
                    </label>
                    <textarea
                      id="ws28_description"
                      name="description"
                      autoComplete="off"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className={`w-full rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-black'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none`}
                      placeholder={t.formDescription}
                    />
                  </div>
                  <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'} text-center pt-2`}>
                    {t.formNote}
                  </p>
                  {formError && (
                    <p className="text-xs text-red-500 text-center">
                      {formError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className={`w-full rounded-xl bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-base font-semibold transition-opacity mt-4 ${
                      formSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
                    }`}
                  >
                    {t.formSubmit}
                  </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-neutral-200' : 'text-neutral-800'} leading-relaxed`}>
                      {t.formSuccess}
                    </p>
                    <button
                      onClick={() => {
                        closeFormModal()
                        navigate('/app')
                      }}
                      className="mt-6 w-full rounded-xl bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-base font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t.formBackToApp}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
