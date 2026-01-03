import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { Resend } from 'resend'

function devContactApi(): Plugin {
  return {
    name: 'dev-contact-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') return next()

        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Missing RESEND_API_KEY' }))
          return
        }

        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
        })

        await new Promise<void>((resolve) => {
          req.on('end', () => resolve())
        })

        let body: any = {}
        try {
          body = raw ? JSON.parse(raw) : {}
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }))
          return
        }

        const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
        const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
        const email = typeof body.email === 'string' ? body.email.trim() : ''
        const description = typeof body.description === 'string' ? body.description.trim() : ''

        if (!fullName || !phone || !email) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Missing required fields' }))
          return
        }

        const resend = new Resend(apiKey)
        const to = 'bgwebstudio28@gmail.com'
        const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'

        try {
          const { data, error } = await resend.emails.send({
            from,
            to,
            replyTo: email,
            subject: `WebStudio28 inquiry: ${fullName}`,
            text: [
              'New inquiry from /webstudio28 (dev)',
              '',
              `Full name: ${fullName}`,
              `Phone: ${phone}`,
              `Email: ${email}`,
              description ? `Description: ${description}` : 'Description: (not provided)',
            ].join('\n'),
          })

          if (error) {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: error.message }))
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, id: data?.id }))
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Unknown error'
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: msg }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env, .env.local, .env.[mode], .env.[mode].local into an object
  // and hydrate process.env so our dev-only middleware can read RESEND_*.
  const env = loadEnv(mode, process.cwd(), '')
  // Important: prefer values from env files so changing .env.local actually takes effect.
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY
  if (env.RESEND_FROM) process.env.RESEND_FROM = env.RESEND_FROM

  return {
    plugins: [
      react(),
      devContactApi(),
      VitePWA({
        registerType: 'prompt', // Changed from 'autoUpdate' to 'prompt' - less aggressive updates
        injectRegister: 'auto',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          // landing-bg.png is > 2 MiB; bump the default precache file size limit so build doesn't fail
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
        },
        manifest: {
          name: 'resto26',
          short_name: 'resto26',
          description:
            'Offline-first euro transition calculator for Bulgarian retailers with dual currency input and change breakdown.',
          start_url: '/',
          display: 'standalone',
          display_override: ['standalone', 'fullscreen'],
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#002855',
          lang: 'bg',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
          shortcuts: [
            {
              name: 'New calculation',
              short_name: 'New calc',
              description: 'Reset inputs for a new transaction',
              url: '/?reset=true',
              icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
            },
          ],
        },
      }),
    ],
  }
})
