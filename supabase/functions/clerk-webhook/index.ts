// supabase/functions/clerk-webhook/index.ts
// Receives Clerk webhook events, creates Supabase profile, sends Resend welcome email
// Deploy: supabase functions deploy clerk-webhook
// Register webhook URL in Clerk Dashboard → Webhooks → Add endpoint:
//   https://axkbcjwlxhjczbjirxyb.supabase.co/functions/v1/clerk-webhook
// Events to subscribe: user.created, user.updated

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Webhook }      from 'https://esm.sh/svix@1.22.0'

const RESEND_API_KEY    = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CLERK_WEBHOOK_SECRET      = Deno.env.get('CLERK_WEBHOOK_SECRET')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Verify Clerk webhook signature
  const svixId        = req.headers.get('svix-id') ?? ''
  const svixTimestamp = req.headers.get('svix-timestamp') ?? ''
  const svixSignature = req.headers.get('svix-signature') ?? ''
  const body          = await req.text()

  let payload: any
  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET)
    payload = wh.verify(body, {
      'svix-id':        svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Unauthorized', { status: 401 })
  }

  const { type, data } = payload

  if (type === 'user.created' || type === 'user.updated') {
    const role        = (data.unsafe_metadata?.role as string) ?? 'buyer'
    const email       = data.email_addresses?.[0]?.email_address ?? ''
    const firstName   = data.first_name ?? ''
    const lastName    = data.last_name  ?? ''
    const fullName    = `${firstName} ${lastName}`.trim() || email
    const avatarUrl   = data.image_url ?? null
    const onboarding  = ['agent', 'host'].includes(role) ? false : true

    // Upsert profile (service_role bypasses RLS)
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          clerk_user_id:     data.id,
          full_name:         fullName,
          avatar_url:        avatarUrl,
          email,
          role,
          onboarding_complete: onboarding,
        },
        { onConflict: 'email' }
      )

    if (upsertError) {
      console.error('Profile upsert failed:', upsertError)
    }

    // Send welcome email for agents only on user.created
    if (type === 'user.created' && role === 'agent' && email) {
      await sendWelcomeAgentEmail({ email, name: firstName || 'Agent' })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})

async function sendWelcomeAgentEmail({ email, name }: { email: string; name: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    'Savanah Dwelling <onboarding@savanahwelling.co.ke>',  // update to your verified Resend domain
      to:      [email],
      subject: '🏠 Welcome Agent — Savanah Dwelling',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
          <h1 style="color:#16a34a;font-size:24px;margin-bottom:8px">Welcome, ${name}! 🎉</h1>
          <p style="color:#374151;font-size:16px;line-height:1.6">
            You've successfully joined <strong>Savanah Dwelling</strong> as a <strong>Real Estate Agent</strong>.
          </p>
          <p style="color:#374151;font-size:16px;line-height:1.6">
            You can now list properties, connect with buyers, and manage your portfolio from the Agent Dashboard.
          </p>
          <a href="https://savanahdwellings.co.ke/agent"
             style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
            Go to Agent Dashboard →
          </a>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0" />
          <p style="color:#9ca3af;font-size:12px">
            Savanah Dwelling · Savanah Dwelling<br/>
            Questions? Reply to this email.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error('Resend error:', errBody)
  }
}
