// supabase/functions/send-branded-confirmation-email/index.ts
// Creates confirmation session and sends branded welcome email
// Deploy: supabase functions deploy send-branded-confirmation-email
// Secrets: supabase secrets set RESEND_API_KEY=re_xxx

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

const ROLE_CONFIG = {
  agent: {
    title: 'Real Estate Agent',
    dashboardUrl: 'https://savanah-dwelling.co.ke/verification?role=agent',
    heading: 'Welcome to Savanah Dwelling, Agent!',
    description: 'Your agent account is ready. Complete verification to start listing properties.',
  },
  host: {
    title: 'Airbnb Host',
    dashboardUrl: 'https://savanah-dwelling.co.ke/verification?role=host',
    heading: 'Welcome to Savanah Dwelling, Host!',
    description: 'Your host account is ready. Complete verification to start hosting.',
  },
  professional: {
    title: 'Professional',
    dashboardUrl: 'https://savanah-dwelling.co.ke/verification?role=professional',
    heading: 'Welcome to Savanah Dwelling, Professional!',
    description: 'Your professional account is ready. Complete verification to offer your services.',
  },
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { clerk_user_id, email, first_name, role } = await req.json()

  if (!clerk_user_id || !email || !role) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: clerk_user_id, email, role' }),
      { status: 400 }
    )
  }

  if (!['agent', 'host', 'professional'].includes(role)) {
    return new Response(
      JSON.stringify({ error: 'Invalid role. Must be agent, host, or professional' }),
      { status: 400 }
    )
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Create confirmation session in database
  const createSessionRes = await fetch(`${supabaseUrl}/rest/v1/rpc/create_email_confirmation_session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      p_clerk_user_id: clerk_user_id,
      p_email: email,
      p_role: role,
    }),
  })

  if (!createSessionRes.ok) {
    const error = await createSessionRes.text()
    console.error('Failed to create session:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create confirmation session' }),
      { status: 500 }
    )
  }

  const sessionData = await createSessionRes.json()
  
  // Get the confirmation link
  const getLinkRes = await fetch(
    `${supabaseUrl}/rest/v1/email_confirmation_sessions?id=eq.${sessionData}&select=confirmation_link`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    }
  )
  
  const sessions = await getLinkRes.json()
  const confirmationLink = sessions[0]?.confirmation_link

  if (!confirmationLink) {
    return new Response(
      JSON.stringify({ error: 'Failed to get confirmation link' }),
      { status: 500 }
    )
  }

  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]
  const name = first_name || 'there'

  // Send branded email via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Savanah Dwelling <onboarding@savanah-dwelling.co.ke>',
      to: [email],
      subject: `🏠 Confirm Your ${config.title} Account — Savanah Dwelling`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05)">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);padding:40px 32px;text-align:center">
        <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0">Savanah Dwelling</h1>
        <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:8px 0 0">Kenya's Trusted Real Estate Platform</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding:40px 32px">
        <h2 style="color:#111827;font-size:22px;font-weight:600;margin:0 0 16px">${config.heading}</h2>
        <p style="color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px">
          Hi ${name},<br><br>
          ${config.description}
        </p>
        
        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="${confirmationLink}" 
                 style="display:inline-block;background:#16a34a;color:#ffffff;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">
                Confirm Your Account →
              </a>
            </td>
          </tr>
        </table>
        
        <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;text-align:center">
          This link expires in 24 hours.<br>
          If you didn't create an account, please ignore this email.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="color:#6b7280;font-size:12px;margin:0">
          © ${new Date().getFullYear()} Savanah Dwelling. All rights reserved.
        </p>
        <p style="color:#9ca3af;font-size:11px;margin:8px 0 0">
          Kenya's #1 Real Estate Platform
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error('Resend API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: error }),
      { status: 500 }
    )
  }

  const emailResult = await res.json()

  return new Response(
    JSON.stringify({
      success: true,
      session_id: sessionData,
      confirmation_link: confirmationLink,
      email_id: emailResult.id,
    }),
    { status: 200 }
  )
})
