type Props = {
  open: boolean
  isDark: boolean
  headline: string
  ctaLabel: string
  secondaryLabel?: string
  closeAriaLabel: string
  onClose: () => void
  onCta: () => void
  onSecondary?: () => void
}

export function DailyPromoModal({
  open,
  isDark,
  headline,
  ctaLabel,
  secondaryLabel,
  closeAriaLabel,
  onClose,
  onCta,
  onSecondary,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
        className={`relative w-full max-w-[528px] rounded-2xl border shadow-lg ${
          isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
        }`}
      >
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="text-base font-semibold text-black dark:text-white leading-snug text-center w-full">
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

          <button
            type="button"
            onClick={onCta}
            className="mt-4 w-full rounded-xl border border-neutral-900 bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
          >
            {ctaLabel}
          </button>

          {secondaryLabel && onSecondary ? (
            <button
              type="button"
              onClick={onSecondary}
              className="mt-3 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-white transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}


