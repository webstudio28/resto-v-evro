const DEVICE_ID_KEY = 'evrolev_device_id'

export function getDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY)
  if (existing) {
    return existing
  }

  // Generate new device ID using crypto.randomUUID if available, fallback to timestamp + random
  let newId: string
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    newId = crypto.randomUUID()
  } else {
    newId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  localStorage.setItem(DEVICE_ID_KEY, newId)
  return newId
}

export function resetDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY)
  console.log('Device ID reset')
}

