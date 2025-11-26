interface IOSModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export function IOSModal({ isOpen, onClose, onContinue }: IOSModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-black dark:text-white text-center">
          В момента инсталацията за устройства на IOS не е налична моля използвайте в браузара
        </p>
        <button
          onClick={onContinue}
          className="w-full rounded-xl bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-base"
        >
          Използвай без инсталация
        </button>
      </div>
    </div>
  )
}

