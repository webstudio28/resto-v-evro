import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InstallPrompt } from './components/InstallPrompt'
import lightLogo from './assets/light-logo.png'
import darkLogo from './assets/dark-logo.png'
import languageLight from './assets/language-light.png'
import languageDark from './assets/language-dark.png'
import themeLight from './assets/theme-light.png'
import themeDark from './assets/theme-dark.png'

type Language = 'en' | 'bg'

const BGN_PER_EUR = 1.95583

function formatMoney(value: number): string {
  return value.toFixed(2)
}

function clampToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}

function parseNumber(input: string): number {
  const normalized = input.replace(',', '.')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'Euro Transition Calculator',
    productPrice: 'Full price (EUR)',
    paymentBGN: 'Payment in BGN',
    paymentEUR: 'Payment in EUR',
    changeDue: 'Change due (EUR)',
    breakdown: 'Calculation breakdown',
    rate: 'Fixed rate',
    clear: 'Clear',
    errorInsufficient: 'Insufficient payment',
    receipt: 'Receipt',
    paid: 'Paid',
    price: 'Price',
    totalPaid: 'Total paid (EUR)',
    bgnToEur: 'BGN → EUR',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    showKeypad: 'Show keypad',
    hideKeypad: 'Hide keypad',
    footerText: 'Website for your business? See',
    clearAll: 'Clear all',
  },
  bg: {
    title: 'Калкулатор за преход към еврото',
    productPrice: 'Цяла сума в евро (EUR)',
    paymentBGN: 'Плащане в BGN',
    paymentEUR: 'Плащане в EUR',
    changeDue: 'Ресто (EUR)',
    breakdown: 'Разбивка на изчисленията',
    rate: 'Фиксиран курс',
    clear: 'Изчисти',
    errorInsufficient: 'Недостатъчна сума',
    receipt: 'Касов бон',
    paid: 'Платено',
    price: 'Цена',
    totalPaid: 'Общо платено (EUR)',
    bgnToEur: 'BGN → EUR',
    language: 'Език',
    theme: 'Тема',
    light: 'Светла',
    dark: 'Тъмна',
    showKeypad: 'Покажи клавиатура',
    hideKeypad: 'Скрий клавиатура',
    footerText: 'Уебсайт за вашия бизнес? Вижте',
    clearAll: 'Изчисти всичко',
  },
}

function useTheme(): [string, (t: 'light' | 'dark') => void] {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, (t) => setTheme(t)]
}

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
    } else {
      ;(mql as any).onchange = handler
    }
    setIsDesktop(mql.matches)
    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', handler)
      } else {
        ;(mql as any).onchange = null
      }
    }
  }, [])
  return isDesktop
}

function App() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>('bg')
  const t = useMemo(() => translations[language], [language])
  const [theme, setTheme] = useTheme()
  const isDesktop = useIsDesktop()
  const [keypadVisible, setKeypadVisible] = useState<boolean>(true)

  const [priceEURInput, setPriceEURInput] = useState('')
  const [payBGNInput, setPayBGNInput] = useState('')
  const [payEURInput, setPayEURInput] = useState('')

  type ActiveField = 'price' | 'bgn' | 'eur' | null
  const [activeField, setActiveField] = useState<ActiveField>(null)
  const [changeInBGN, setChangeInBGN] = useState(false)

  const priceEUR = clampToTwoDecimals(parseNumber(priceEURInput))
  const payBGN = clampToTwoDecimals(parseNumber(payBGNInput))
  const payEUR = clampToTwoDecimals(parseNumber(payEURInput))

  // Convert BGN to EUR using exact division (1 EUR = 1.95583 BGN)
  const payBGNtoEUR = clampToTwoDecimals(payBGN / BGN_PER_EUR)
  const totalPaidEUR = clampToTwoDecimals(payEUR + payBGNtoEUR)
  const changeEURRaw = clampToTwoDecimals(totalPaidEUR - priceEUR)
  const isSufficient = totalPaidEUR >= priceEUR || priceEUR === 0
  const changeEUR = isSufficient ? changeEURRaw : 0

  function handleClear() {
    setPriceEURInput('')
    setPayBGNInput('')
    setPayEURInput('')
  }

  const decimalChar = language === 'bg' ? ',' : '.'

  function getActiveValue(): [string, (v: string) => void] {
    if (activeField === 'price') return [priceEURInput, setPriceEURInput]
    if (activeField === 'bgn') return [payBGNInput, setPayBGNInput]
    return [payEURInput, setPayEURInput]
  }

  function onKeypadPress(key: '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'decimal'|'backspace'|'clear') {
    const [value, setter] = getActiveValue()
    if (key === 'clear') {
      setter('')
      return
    }
    if (key === 'backspace') {
      setter(value.slice(0, -1))
      return
    }
    if (key === 'decimal') {
      if (value.includes(decimalChar)) return
      if (value === '' || value === '-') setter('0' + decimalChar)
      else setter(value + decimalChar)
      return
    }
    // digit
    const digit = key
    if (value === '0' && !value.includes(decimalChar)) {
      setter(digit)
    } else {
      setter(value + digit)
    }
  }

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
            style={{
              marginBottom: isDesktop
                ? 0
                : `calc(${keypadVisible ? '260px' : '56px'} + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            <div className="p-4 md:p-5">
              <div className={`flex items-center justify-between mb-4 pb-4 rounded-lg ${
                isDark ? 'bg-neutral-800' : 'bg-neutral-100'
              } px-4 pt-3 pb-2 -mx-4 md:-mx-5 md:px-3`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/')}
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
                  <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    aria-label={t.theme}
                    className="outline-none transition-opacity hover:opacity-80 active:opacity-60"
                  >
                    <img
                      src={isDark ? themeDark : themeLight}
                      alt={t.theme}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
              </div>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 transition-colors duration-200 ${
              activeField === 'price' 
                ? 'text-navy-700 dark:text-neutral-200 font-medium' 
                : 'text-neutral-700 dark:text-neutral-200'
            }`}>
              {t.productPrice}
            </label>
            <input
              inputMode="decimal"
              enterKeyHint="done"
              placeholder="0.00"
              value={priceEURInput}
              onChange={(e) => setPriceEURInput(e.target.value)}
              readOnly={!isDesktop}
              onFocus={() => setActiveField('price')}
              onClick={() => setActiveField('price')}
              className={`w-full rounded-xl border-2 px-3 py-2.5 focus:outline-none transition-all duration-200 ${
                activeField === 'price'
                  ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-950'
                  : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950'
              } text-black dark:text-white text-lg`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm mb-1 transition-colors duration-200 ${
                activeField === 'bgn' 
                  ? 'text-navy-700 dark:text-neutral-200 font-medium' 
                  : 'text-neutral-700 dark:text-neutral-200'
              }`}>
                {t.paymentBGN}
              </label>
              <input
                inputMode="decimal"
                enterKeyHint="done"
                placeholder="0.00"
                value={payBGNInput}
                onChange={(e) => setPayBGNInput(e.target.value)}
                readOnly={!isDesktop}
                onFocus={() => setActiveField('bgn')}
                onClick={() => setActiveField('bgn')}
                className={`w-full rounded-xl border-2 px-3 py-2.5 focus:outline-none transition-all duration-200 ${
                  activeField === 'bgn'
                    ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-950'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950'
                } text-black dark:text-white text-lg`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-1 transition-colors duration-200 ${
                activeField === 'eur' 
                  ? 'text-navy-700 dark:text-neutral-200 font-medium' 
                  : 'text-neutral-700 dark:text-neutral-200'
              }`}>
                {t.paymentEUR}
              </label>
              <input
                inputMode="decimal"
                enterKeyHint="done"
                placeholder="0.00"
                value={payEURInput}
                onChange={(e) => setPayEURInput(e.target.value)}
                readOnly={!isDesktop}
                onFocus={() => setActiveField('eur')}
                onClick={() => setActiveField('eur')}
                className={`w-full rounded-xl border-2 px-3 py-2.5 focus:outline-none transition-all duration-200 ${
                  activeField === 'eur'
                    ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-950'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950'
                } text-black dark:text-white text-lg`}
              />
            </div>
          </div>

          {!isSufficient && priceEUR > 0 && (
            <div className="rounded-xl border border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 px-3 py-2 text-sm">
              {t.errorInsufficient}
            </div>
          )}

          <div className={`rounded-xl border-2 ${
            isDark 
              ? 'border-blue-500/30 bg-blue-950/20' 
              : 'border-blue-100 bg-blue-30/50'
          } px-4 py-4 shadow-sm`}>
            <div className="flex items-baseline justify-between">
              <span className="text-neutral-600 dark:text-neutral-400 text-xs">
                {changeInBGN ? t.changeDue.replace('(EUR)', '(BGN)') : t.changeDue}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-black dark:text-white">
                  {changeInBGN ? `${formatMoney(changeEUR * BGN_PER_EUR)} лв` : `€ ${formatMoney(changeEUR)}`}
                </span>
                <button
                  onClick={() => setChangeInBGN(!changeInBGN)}
                  className="outline-none transition-opacity hover:opacity-80 active:opacity-60 rounded-full p-1.5 border border-neutral-700 dark:border-neutral-500 shadow-sm"
                  aria-label="Toggle currency"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-neutral-700 dark:text-neutral-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleClear}
              className="rounded-xl border border-neutral-400 dark:border-neutral-600 px-3 py-1 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {t.clear}
            </button>
          </div>

          <div className={`rounded-xl border ${
            isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
          } p-3`}>
            <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{t.breakdown}</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{t.rate}: 1 EUR = {BGN_PER_EUR} BGN</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.price}</span><span className="text-black dark:text-white font-semibold">€ {formatMoney(priceEUR)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.paid} (EUR)</span><span className="text-black dark:text-white font-semibold">€ {formatMoney(payEUR)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.paid} (BGN)</span><span className="text-black dark:text-white font-semibold">лв {formatMoney(payBGN)}</span></div>
              <div className={`border-t my-2 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`} />
              <div className="flex justify-between font-bold mt-1"><span className="text-neutral-700 dark:text-neutral-300">{t.totalPaid}</span><span className="text-black dark:text-white">€ {formatMoney(totalPaidEUR)}</span></div>
              <div className={`border-t my-2 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`} />
              <div className="flex justify-between font-bold mt-1">
                <span className="text-neutral-700 dark:text-neutral-300">
                  {changeInBGN ? t.changeDue.replace('(EUR)', '(BGN)') : t.changeDue}
                </span>
                <span className="text-black dark:text-white">
                  {changeInBGN ? `${formatMoney(changeEUR * BGN_PER_EUR)} лв` : `€ ${formatMoney(changeEUR)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-xs text-center text-neutral-500 dark:text-neutral-500">
              {t.footerText}{' '}
              <a
                href="https://www.webstudio28.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 dark:text-neutral-300 hover:underline"
              >
                webstudio28.com
              </a>
            </p>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Mobile on-screen numeric keypad with hide/show, constrained to 528px */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center">
        <div className="w-full max-w-[528px]">
          <div className="px-4">
          {!keypadVisible ? (
            <div
              className={`mb-4 rounded-xl border ${
                isDark ? 'border-neutral-600 bg-neutral-900' : 'border-transparent bg-neutral-800'
              } px-3 shadow-sm flex items-center justify-between`}
              style={{ 
                paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)',
              }}
            >
              <span className={`text-sm ${
                isDark ? 'text-neutral-300' : 'text-white'
              }`}>{t.showKeypad}</span>
              <button
                onClick={() => setKeypadVisible(true)}
                aria-label={t.showKeypad}
                title={t.showKeypad}
                className={`text-sm rounded-xl border px-3 py-1 ${
                  isDark 
                    ? 'border-neutral-600 text-neutral-300' 
                    : 'border-white/30 text-white'
                }`}
              >
                ▲
              </button>
            </div>
          ) : (
            <div
              className={`mb-4 rounded-xl border ${
                isDark ? 'border-neutral-600 bg-neutral-900' : 'border-neutral-400 bg-white'
              } px-3 pt-3 pb-2 shadow-sm`}
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
            >
              <div className="flex items-center justify-end mb-2">
                <button
                  onClick={() => setKeypadVisible(false)}
                  aria-label={t.hideKeypad}
                  title={t.hideKeypad}
                  className="text-xs rounded-xl border border-neutral-400 dark:border-neutral-600 px-2 py-1 text-neutral-700 dark:text-neutral-300"
                >
                  ▼
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 select-none">
                {(['1','2','3','4','5','6','7','8','9'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => onKeypadPress(k)}
                    className={`h-12 rounded-xl border ${
                      isDark ? 'border-neutral-600 bg-neutral-950' : 'border-neutral-400 bg-white'
                    } text-lg font-semibold text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-neutral-100 dark:active:bg-neutral-800`}
                  >
                    {k}
                  </button>
                ))}
                <button 
                  onClick={() => onKeypadPress('decimal')} 
                  className={`h-12 rounded-xl border ${
                    isDark ? 'border-neutral-600 bg-neutral-950' : 'border-neutral-400 bg-white'
                  } text-lg font-semibold text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-neutral-100 dark:active:bg-neutral-800`}
                >
                  {decimalChar}
                </button>
                <button 
                  onClick={() => onKeypadPress('0')} 
                  className={`h-12 rounded-xl border ${
                    isDark ? 'border-neutral-600 bg-neutral-950' : 'border-neutral-400 bg-white'
                  } text-lg font-semibold text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-neutral-100 dark:active:bg-neutral-800`}
                >
                  0
                </button>
                <button 
                  onClick={() => onKeypadPress('backspace')} 
                  className={`h-12 rounded-xl border ${
                    isDark ? 'border-neutral-600 bg-neutral-950' : 'border-neutral-400 bg-white'
                  } text-lg font-semibold text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-neutral-100 dark:active:bg-neutral-800`}
                >
                  ⌫
                </button>
              </div>
              <button
                onClick={handleClear}
                className={`w-full mt-2 h-12 rounded-xl border ${
                  isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-400 bg-neutral-100'
                } text-base font-semibold text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-neutral-200 dark:active:bg-neutral-700`}
              >
                {t.clearAll}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
      <InstallPrompt />
      </div>
    </div>
  )
}

export { App }
export default App
