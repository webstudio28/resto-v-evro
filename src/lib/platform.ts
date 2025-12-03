/**
 * Check if running in a native Capacitor app
 */
export function isNativePlatform(): boolean {
  if (typeof window !== 'undefined') {
    // @ts-ignore - Capacitor will be available in native builds
    return window.Capacitor?.isNativePlatform() ?? false
  }
  return false
}

