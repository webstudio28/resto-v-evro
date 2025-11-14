export function setupServiceWorkerUpdates() {
  if ('serviceWorker' in navigator) {
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })

    // Check for updates periodically
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000) // Every hour
      }
    })

    // Listen for update available
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        const shouldUpdate = window.confirm(
          'Налична е нова версия на приложението. Искате ли да я актуализирате сега?'
        )
        if (shouldUpdate) {
          navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' })
        }
      }
    })
  }
}

