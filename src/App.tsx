import { useEffect, useMemo, useState } from 'react'
import { InstallPrompt } from './components/InstallPrompt'

type Language = 'en' | 'bg'

const EUR_PER_BGN = 1 / 1.95583
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
  const [language, setLanguage] = useState<Language>('bg')
  const t = useMemo(() => translations[language], [language])
  const [theme, setTheme] = useTheme()
  const isDesktop = useIsDesktop()
  const [keypadVisible, setKeypadVisible] = useState<boolean>(true)

  const [priceEURInput, setPriceEURInput] = useState('')
  const [payBGNInput, setPayBGNInput] = useState('')
  const [payEURInput, setPayEURInput] = useState('')

  type ActiveField = 'price' | 'bgn' | 'eur'
  const [activeField, setActiveField] = useState<ActiveField>('price')

  const priceEUR = clampToTwoDecimals(parseNumber(priceEURInput))
  const payBGN = clampToTwoDecimals(parseNumber(payBGNInput))
  const payEUR = clampToTwoDecimals(parseNumber(payEURInput))

  const payBGNtoEUR = clampToTwoDecimals(payBGN * EUR_PER_BGN)
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

  return (
    <div className="theme-transition min-h-screen flex items-center justify-center px-4 py-4">
      <div
        className="w-full max-w-[528px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
        style={{
          marginBottom: isDesktop
            ? 0
            : `calc(${keypadVisible ? '260px' : '56px'} + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-black dark:text-white">{t.title}</h1>
          <div className="flex items-center gap-2">
            <select
              aria-label={t.language}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white px-2 py-1 focus:outline-none"
            >
              <option value="en">EN</option>
              <option value="bg">BG</option>
            </select>
            <select
              aria-label={t.theme}
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
              className="rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-black dark:text-white px-2 py-1 focus:outline-none"
            >
              <option value="light">{t.light}</option>
              <option value="dark">{t.dark}</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 transition-colors duration-200 ${
              activeField === 'price' 
                ? 'text-navy-700 dark:text-navy-300 font-medium' 
                : 'text-neutral-700 dark:text-neutral-300'
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
              className={`w-full rounded-xl border px-3 py-2 focus:outline-none transition-colors duration-200 ${
                activeField === 'price'
                  ? 'border-navy-500 dark:border-navy-400 bg-navy-50 dark:bg-navy-900/20'
                  : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
              } text-black dark:text-white`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm mb-1 transition-colors duration-200 ${
                activeField === 'bgn' 
                  ? 'text-navy-700 dark:text-navy-300 font-medium' 
                  : 'text-neutral-700 dark:text-neutral-300'
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
                className={`w-full rounded-xl border px-3 py-2 focus:outline-none transition-colors duration-200 ${
                  activeField === 'bgn'
                    ? 'border-navy-500 dark:border-navy-400 bg-navy-50 dark:bg-navy-900/20'
                    : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                } text-black dark:text-white`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-1 transition-colors duration-200 ${
                activeField === 'eur' 
                  ? 'text-navy-700 dark:text-navy-300 font-medium' 
                  : 'text-neutral-700 dark:text-neutral-300'
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
                className={`w-full rounded-xl border px-3 py-2 focus:outline-none transition-colors duration-200 ${
                  activeField === 'eur'
                    ? 'border-navy-500 dark:border-navy-400 bg-navy-50 dark:bg-navy-900/20'
                    : 'border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                } text-black dark:text-white`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{t.rate}: 1 EUR = {BGN_PER_EUR} BGN</span>
            <button
              onClick={handleClear}
              className="rounded-xl border border-neutral-400 dark:border-neutral-600 px-3 py-1 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {t.clear}
            </button>
          </div>

          {!isSufficient && priceEUR > 0 && (
            <div className="rounded-xl border border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 px-3 py-2 text-sm">
              {t.errorInsufficient}
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-3">
            <div className="flex items-baseline justify-between">
              <span className="text-neutral-600 dark:text-neutral-400 text-sm">{t.changeDue}</span>
              <span className="text-3xl font-semibold text-black dark:text-white">€ {formatMoney(changeEUR)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t.breakdown}</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.price}</span><span>€ {formatMoney(priceEUR)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.paid} (EUR)</span><span>€ {formatMoney(payEUR)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.paid} (BGN)</span><span>лв {formatMoney(payBGN)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-600 dark:text-neutral-400">{t.bgnToEur}</span><span>€ {formatMoney(payBGNtoEUR)}</span></div>
              <div className="border-t border-neutral-200 dark:border-neutral-800 my-2" />
              <div className="flex justify-between font-medium"><span className="text-neutral-700 dark:text-neutral-300">{t.totalPaid}</span><span>€ {formatMoney(totalPaidEUR)}</span></div>
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
              className="mb-4 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-3 py-2 shadow-sm flex items-center justify-between"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}
            >
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{t.showKeypad}</span>
              <button
                onClick={() => setKeypadVisible(true)}
                aria-label={t.showKeypad}
                title={t.showKeypad}
                className="text-sm rounded-xl border border-neutral-400 dark:border-neutral-600 px-3 py-1"
              >
                ▲
              </button>
            </div>
          ) : (
            <div
              className="mb-4 bg-gray-50 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-3 pt-3 pb-2 shadow-md"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
            >
              <div className="flex items-center justify-end mb-2">
                <div className="flex items-center gap-2">
                  <button onClick={handleClear} className="text-xs rounded-xl border border-neutral-400 dark:border-neutral-600 px-2 py-1 text-neutral-700 dark:text-neutral-300">{t.clear}</button>
                  <button
                    onClick={() => setKeypadVisible(false)}
                    aria-label={t.hideKeypad}
                    title={t.hideKeypad}
                    className="text-xs rounded-xl border border-neutral-400 dark:border-neutral-600 px-2 py-1 text-neutral-700 dark:text-neutral-300"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 select-none">
                {(['1','2','3','4','5','6','7','8','9'] as const).map(k => (
                                  <button
                  key={k}
                  onClick={() => onKeypadPress(k)}
                  className="h-12 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-lg font-medium text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-navy-100 dark:active:bg-navy-800 active:border-navy-300 dark:active:border-navy-600"
                >
                  {k}
                </button>
                ))}
                <button 
                  onClick={() => onKeypadPress('decimal')} 
                  className="h-12 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-lg font-medium text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-navy-100 dark:active:bg-navy-800 active:border-navy-300 dark:active:border-navy-600"
                >
                  {decimalChar}
                </button>
                <button 
                  onClick={() => onKeypadPress('0')} 
                  className="h-12 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-lg font-medium text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-navy-100 dark:active:bg-navy-800 active:border-navy-300 dark:active:border-navy-600"
                >
                  0
                </button>
                <button 
                  onClick={() => onKeypadPress('backspace')} 
                  className="h-12 rounded-xl border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-lg font-medium text-black dark:text-white transition-all duration-150 active:scale-[0.95] active:bg-navy-100 dark:active:bg-navy-800 active:border-navy-300 dark:active:border-navy-600"
                >
                  ⌫
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
      <InstallPrompt />
    </div>
  )
}

export { App }
export default App
