interface AndroidSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  appName: string
  isMobile?: boolean
}

export function AndroidSuccessModal({
  isOpen,
  onClose,
  appName,
  isMobile = false,
}: AndroidSuccessModalProps) {
  if (!isOpen) return null

  const deviceText = isMobile
    ? 'Приложението е инсталорано. Можете да го използвате директно от телефона си.'
    : 'Приложението е инсталорано. Можете да го използвате директно от компютъра си.'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <p className="text-black dark:text-white font-medium">
            Готово! {appName} е инсталирано
          </p>
          <p className="text-black dark:text-white text-sm">
            {deviceText}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-white dark:bg-black border border-neutral-400 dark:border-neutral-600 px-8 py-3 text-base"
        >
          Затвори
        </button>
      </div>
    </div>
  )
}

