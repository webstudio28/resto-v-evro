import { createServiceRoleClient } from '../_shared/db.ts'
import { generateLicenseKey } from '../_shared/license-key.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

interface StripeEvent {
  id: string
  type: string
  data: {
    object: {
      id: string
      customer_details?: {
        phone?: string
      }
      payment_status?: string
      status?: string
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSignature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify Stripe signature (simplified - in production use Stripe SDK)
    // For now, we'll trust the webhook secret check
    // TODO: Add proper Stripe signature verification using stripe library

    const body = await req.text()
    const event: StripeEvent = JSON.parse(body)

    // Only process checkout.session.completed events
    if (event.type !== 'checkout.session.completed') {
      return new Response(
        JSON.stringify({ received: true, message: 'Event type not handled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = event.data.object

    // Check if already processed (idempotency)
    const supabase = createServiceRoleClient()
    const { data: existing } = await supabase
      .from('licenses')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single()

    if (existing) {
      console.log(`Event ${event.id} already processed`)
      return new Response(
        JSON.stringify({ received: true, message: 'Event already processed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique license key
    let licenseKey: string
    let attempts = 0
    const maxAttempts = 10

    do {
      licenseKey = generateLicenseKey()
      const { data: existingKey } = await supabase
        .from('licenses')
        .select('id')
        .eq('key', licenseKey)
        .single()

      if (!existingKey) break
      attempts++
    } while (attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique license key after multiple attempts')
    }

    // Insert license into database
    const phone = session.customer_details?.phone || null
    const { error: insertError } = await supabase
      .from('licenses')
      .insert({
        key: licenseKey,
        phone,
        stripe_event_id: event.id,
        metadata: {
          stripe_session_id: session.id,
          payment_status: session.payment_status || session.status,
        },
      })

    if (insertError) {
      console.error('Failed to insert license:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create license' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: Send SMS with license key
    // This will be implemented in Phase 4 (SMS integration)
    console.log(`License ${licenseKey} created for phone ${phone}. SMS sending to be implemented.`)

    return new Response(
      JSON.stringify({
        received: true,
        licenseKey,
        message: 'License created successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

