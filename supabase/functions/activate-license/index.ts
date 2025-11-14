import { createServiceRoleClient } from '../_shared/db.ts'
import { generateActivationToken } from '../_shared/jwt.ts'
import { isValidLicenseKeyFormat } from '../_shared/license-key.ts'
import { checkRateLimit, cleanupRateLimitStore } from '../_shared/rate-limit.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ActivationRequest {
  licenseKey: string
  deviceId: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Clean up rate limit store periodically
    cleanupRateLimitStore()

    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    
    // Parse request
    const body: ActivationRequest = await req.json()
    const { licenseKey, deviceId } = body

    // Validate input
    if (!licenseKey || !deviceId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing licenseKey or deviceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isValidLicenseKeyFormat(licenseKey)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid license key format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting: 5 attempts per minute per IP+device
    const rateLimitKey = `${clientIp}:${deviceId}`
    if (checkRateLimit(rateLimitKey, 5, 60 * 1000)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many activation attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Supabase client
    const supabase = createServiceRoleClient()

    // Find license
    const { data: license, error: fetchError } = await supabase
      .from('licenses')
      .select('*')
      .eq('key', licenseKey)
      .single()

    if (fetchError || !license) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid license key' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already activated
    if (license.activated) {
      // Allow reactivation if same device
      if (license.device_id === deviceId) {
        // Generate new token for existing activation
        const token = await generateActivationToken(licenseKey, deviceId)
        return new Response(
          JSON.stringify({
            success: true,
            token,
            message: 'License already activated on this device',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ success: false, error: 'License already activated on another device' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Activate license
    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        activated: true,
        device_id: deviceId,
        activated_at: new Date().toISOString(),
        metadata: {
          ...(license.metadata || {}),
          activation_ip: clientIp,
          activation_user_agent: req.headers.get('user-agent') || 'unknown',
        },
      })
      .eq('id', license.id)

    if (updateError) {
      console.error('Failed to activate license:', updateError)
      return new Response(
        JSON.stringify({ success: false, error: 'Activation failed. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate activation token
    const token = await generateActivationToken(licenseKey, deviceId)

    return new Response(
      JSON.stringify({
        success: true,
        token,
        message: 'License activated successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Activation error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

