/**
 * Generate a secure, unique license key
 * Format: EVRO-XXXX-XXXX-XXXX-XXXX (20+ chars, alphanumeric)
 */
export function generateLicenseKey(): string {
  const segments: string[] = ['EVRO']
  
  // Generate 4 segments of 4 uppercase alphanumeric characters
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude ambiguous chars (0, O, I, 1)
  
  for (let i = 0; i < 4; i++) {
    let segment = ''
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  
  return segments.join('-')
}

/**
 * Validate license key format
 */
export function isValidLicenseKeyFormat(key: string): boolean {
  const pattern = /^EVRO-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/
  return pattern.test(key) && key.length >= 20
}

