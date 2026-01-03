import { Resend } from 'resend'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Payload = {
  fullName?: string
  phone?: string
  email?: string
  description?: string
  page?: string
  language?: string
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'Missing RESEND_API_KEY' })
  }

  const body = (req.body ?? {}) as Payload

  const fullName = asString(body.fullName).trim()
  const phone = asString(body.phone).trim()
  const email = asString(body.email).trim()
  const description = asString(body.description).trim()
  const page = asString(body.page).trim()
  const language = asString(body.language).trim()

  if (!fullName || !phone || !email) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' })
  }

  const resend = new Resend(apiKey)
  const to = 'bgwebstudio28@gmail.com'
  const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

  const subject = `WebStudio28 inquiry: ${fullName}`
  const userAgent = asString(req.headers['user-agent'])
  const ip =
    (Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for']) ?? ''

  const text = [
    'New inquiry from /webstudio28',
    '',
    `Full name: ${fullName}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    description ? `Description: ${description}` : 'Description: (not provided)',
    '',
    page ? `Page: ${page}` : '',
    language ? `Language: ${language}` : '',
    userAgent ? `User-Agent: ${userAgent}` : '',
    ip ? `IP: ${ip}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    })

    if (error) {
      return res.status(502).json({ ok: false, error: error.message })
    }

    return res.status(200).json({ ok: true, id: data?.id })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return res.status(500).json({ ok: false, error: msg })
  }
}


