// supabase/functions/clerk-webhook/index.ts
// Receives Clerk webhook events, creates Supabase profile, sends branded confirmation email
// Deploy: supabase functions deploy clerk-webhook
// Register webhook URL in Clerk Dashboard → Webhooks → Add endpoint:
//   https://your-project.supabase.co/functions/v1/clerk-webhook
// Events to subscribe: user.created

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Webhook } from 'https://esm.sh/svix@1.22.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CLERK_WEBHOOK_SECRET = Deno.env.get('CLERK_WEBHOOK_SECRET')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const VERIFICATION_ROLES = ['agent', 'host', 'professional']

const ROLE_CONFIG: Record<string, { title: string; dashboardUrl: string; heading: string; description: string }> = {
  agent: {
    title: 'Real Estate Agent',
    dashboardUrl: '/verification?role=agent',
    heading: 'Welcome to Savanah Dwelling, Agent!',
    description: 'Your agent account is ready. Complete verification to start listing properties.',
  },
  host: {
    title: 'Airbnb Host',
    dashboardUrl: '/verification?role=host',
    heading: 'Welcome to Savanah Dwelling, Host!',
    description: 'Your host account is ready. Complete verification to start hosting.',
  },
  professional: {
    title: 'Professional',
    dashboardUrl: '/verification?role=professional',
    heading: 'Welcome to Savanah Dwelling, Professional!',
    description: 'Your professional account is ready. Complete verification to offer your services.',
  },
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const svixId = req.headers.get('svix-id') ?? ''
  const svixTimestamp = req.headers.get('svix-timestamp') ?? ''
  const svixSignature = req.headers.get('svix-signature') ?? ''
  const body = await req.text()

  let payload: any
  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET)
    payload = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Unauthorized', { status: 401 })
  }

  const { type, data } = payload

  if (type === 'user.created') {
    const role = (data.unsafe_metadata?.role as string) ?? 'tenant'
    const email = data.email_addresses?.[0]?.email_address ?? ''
    const firstName = data.first_name ?? ''
    const lastName = data.last_name ?? ''
    const fullName = `${firstName} ${lastName}`.trim() || email
    const avatarUrl = data.image_url ?? null
    
    const requiresVerification = VERIFICATION_ROLES.includes(role)
    const onboardingComplete = !requiresVerification

    console.log(`Processing new user: ${email}, role: ${role}, requiresVerification: ${requiresVerification}`)

    // Upsert profile (service_role bypasses RLS)
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          clerk_user_id: data.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          email,
          role,
          onboarding_complete: onboardingComplete,
        },
        { onConflict: 'email' }
      )

    if (upsertError) {
      console.error('Profile upsert failed:', upsertError)
      return new Response(JSON.stringify({ error: 'Failed to create profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Send branded confirmation email for verification-required roles
    if (requiresVerification && email) {
      try {
        const { data: fnData, error: fnError } = await supabaseAdmin.functions.invoke(
          'send-branded-confirmation-email',
          {
            body: {
              clerk_user_id: data.id,
              email: email,
              first_name: firstName,
              role: role,
            },
          }
        )

        if (fnError) {
          console.error('Failed to send branded confirmation email:', fnError)
        } else {
          console.log('Branded confirmation email sent successfully:', fnData)
        }
      } catch (emailError) {
        console.error('Error sending branded confirmation email:', emailError)
        // Don't fail the webhook response - profile was created successfully
      }
    }

    return new Response(JSON.stringify({ 
      received: true, 
      profile_created: true,
      email_sent: requiresVerification && !!email,
      role: role,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  if (type === 'user.updated') {
    const role = (data.unsafe_metadata?.role as string) ?? 'tenant'
    const email = data.email_addresses?.[0]?.email_address ?? ''
    const firstName = data.first_name ?? ''
    const lastName = data.last_name ?? ''
    const fullName = `${firstName} ${lastName}`.trim() || email
    const avatarUrl = data.image_url ?? null

    const requiresVerification = VERIFICATION_ROLES.includes(role)
    const onboardingComplete = !requiresVerification

    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        role: role,
        onboarding_complete: onboardingComplete,
      })
      .eq('clerk_user_id', data.id)

    if (upsertError) {
      console.error('Profile update failed:', upsertError)
    }

    return new Response(JSON.stringify({ received: true, updated: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  return new Response(JSON.stringify({ received: true, type: type }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
