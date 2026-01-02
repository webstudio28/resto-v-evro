export function setupServiceWorkerUpdates() {
  if ('serviceWorker' in navigator) {
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })

    // Check for updates less frequently (only on page load and when user returns)
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        // Check once on page load, not periodically
        registration.update().catch(() => {
          // Silent fail if update check fails
        })
        
        // Only check again when user comes back to the tab (after being away)
        let lastCheck = Date.now()
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            const timeSinceLastCheck = Date.now() - lastCheck
            // Only check if user was away for more than 1 hour
            if (timeSinceLastCheck > 60 * 60 * 1000) {
              registration.update().catch(() => {})
              lastCheck = Date.now()
            }
          }
        })
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

