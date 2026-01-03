import { useMemo, useState } from 'react'

type CarouselItem = {
  image: string
  title?: string
  subtitle?: string
}

type Props = {
  open: boolean
  isDark: boolean
  headline: string
  ctaLabel: string
  carouselAriaLabel: string
  closeAriaLabel: string
  onClose: () => void
  onCta: () => void
  items?: CarouselItem[]
}

export function DailyPromoModal({
  open,
  isDark,
  headline,
  ctaLabel,
  carouselAriaLabel,
  closeAriaLabel,
  onClose,
  onCta,
  items,
}: Props) {
  const slides = useMemo<CarouselItem[]>(() => {
    return (
      items ?? [
        { image: '', title: 'Website #1', subtitle: 'Placeholder' },
        { image: '', title: 'Website #2', subtitle: 'Placeholder' },
        { image: '', title: 'Website #3', subtitle: 'Placeholder' },
        { image: '', title: 'Website #4', subtitle: 'Placeholder' },
        { image: '', title: 'Website #5', subtitle: 'Placeholder' },
      ]
    )
  }, [items])

  const [idx, setIdx] = useState(0)

  if (!open) return null

  const current = slides[idx] ?? slides[0]

  const cardBg = [
    'from-blue-500/15 to-indigo-500/10',
    'from-emerald-500/15 to-teal-500/10',
    'from-amber-500/15 to-orange-500/10',
    'from-fuchsia-500/15 to-pink-500/10',
    'from-cyan-500/15 to-sky-500/10',
  ][idx % 5]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={closeAriaLabel}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Sheet / Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-[528px] rounded-t-2xl md:rounded-2xl border shadow-lg ${
          isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
        }`}
      >
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="text-base font-semibold text-black dark:text-white leading-snug">
              {headline}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className="rounded-xl border border-neutral-300 dark:border-neutral-700 px-2 py-1 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span className="text-red-500">✕</span>
            </button>
          </div>

          {/* Carousel */}
          <div className="mt-4" aria-label={carouselAriaLabel}>
            <div
              className={`relative overflow-hidden rounded-xl border ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}
            >
              <div
                className={`h-[30vh] w-full bg-gradient-to-br ${cardBg} ${
                  isDark ? 'from-white/10 to-white/5' : ''
                } flex items-center justify-center overflow-hidden`}
              >
                {current?.image ? (
                  <img
                    src={current.image}
                    alt={current.title || `Website ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-black dark:text-white">
                      {current?.title}
                    </div>
                    {current?.subtitle && (
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {current.subtitle}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 border border-neutral-900 bg-black text-white shadow-sm hover:bg-neutral-900"
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setIdx((i) => (i + 1) % slides.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 border border-neutral-900 bg-black text-white shadow-sm hover:bg-neutral-900"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            <div className="mt-2 flex items-center justify-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 w-2 rounded-full ${
                    i === idx
                      ? 'bg-neutral-900 dark:bg-white'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onCta}
            className="mt-4 w-full rounded-xl border border-neutral-900 bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  )
}


