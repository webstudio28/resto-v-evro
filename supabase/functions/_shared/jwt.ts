import { create, verify } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

const JWT_SECRET = Deno.env.get('ACTIVATION_JWT_SECRET') || 'change-me-in-production'
const JWT_ALG = 'HS256'

export interface ActivationTokenPayload {
  licenseKey: string
  deviceId: string
  activatedAt: number
  exp: number
}

/**
 * Generate a short-lived activation token (valid for 30 days)
 */
export async function generateActivationToken(
  licenseKey: string,
  deviceId: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 30 * 24 * 60 * 60 // 30 days in seconds

  const payload: ActivationTokenPayload = {
    licenseKey,
    deviceId,
    activatedAt: now,
    exp: now + expiresIn,
  }

  return await create({ alg: JWT_ALG, typ: 'JWT' }, payload, JWT_SECRET)
}

/**
 * Verify and decode activation token
 */
export async function verifyActivationToken(token: string): Promise<ActivationTokenPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET, JWT_ALG)
    return payload as ActivationTokenPayload
  } catch {
    return null
  }
}

