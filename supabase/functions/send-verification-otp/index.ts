import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOtpRequest {
  phone_number: string;
  otp_code: string;
  purpose?: 'verification' | 'login';
}

interface SmsProviderResponse {
  success: boolean;
  message_id?: string;
  error?: string;
}

async function sendSmsViaProvider(
  phoneNumber: string, 
  message: string,
  provider: string
): Promise<SmsProviderResponse> {
  const providerConfig = Deno.env.get(`${provider.toUpperCase()}_CONFIG`);
  
  if (!providerConfig) {
    console.error(`SMS provider ${provider} not configured`);
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const config = JSON.parse(providerConfig);
    
    switch (provider) {
      case 'twilio':
        return await sendTwilioSms(phoneNumber, message, config);
      case 'africastalking':
        return await sendAfricasTalkingSms(phoneNumber, message, config);
      case 'infobip':
        return await sendInfobipSms(phoneNumber, message, config);
      default:
        return { success: false, error: 'Unknown SMS provider' };
    }
  } catch (error) {
    console.error(`Error sending SMS via ${provider}:`, error);
    return { success: false, error: String(error) };
  }
}

async function sendTwilioSms(
  phoneNumber: string, 
  message: string, 
  config: { accountSid: string; authToken: string; from: string }
): Promise<SmsProviderResponse> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
  
  const body = new URLSearchParams({
    To: phoneNumber,
    From: config.from,
    Body: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${config.accountSid}:${config.authToken}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Twilio error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }

  const data = await response.json();
  return { success: true, message_id: data.sid };
}

async function sendAfricasTalkingSms(
  phoneNumber: string, 
  message: string, 
  config: { username: string; apiKey: string; from: string }
): Promise<SmsProviderResponse> {
  const url = 'https://api.africastalking.com/version1/messaging';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${config.username}:${config.apiKey}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: config.username,
      to: phoneNumber,
      message: message,
      from: config.from,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Africa\'s Talking error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }

  const data = await response.json();
  const smsResponse = data.SMSMessageData;
  
  if (smsResponse.Recipients[0].status === 'Success') {
    return { success: true, message_id: smsResponse.Recipients[0].messageId };
  }
  
  return { success: false, error: smsResponse.Recipients[0].status };
}

async function sendInfobipSms(
  phoneNumber: string, 
  message: string, 
  config: { baseUrl: string; apiKey: string; from: string }
): Promise<SmsProviderResponse> {
  const url = `${config.baseUrl}/sms/2/text/single`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `App ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: phoneNumber,
      text: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Infobip error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }

  const data = await response.json();
  
  if (data.messages && data.messages[0]?.status?.groupName === 'OK') {
    return { success: true, message_id: data.messages[0].messageId };
  }
  
  return { success: false, error: data.messages?.[0]?.status?.name || 'Failed to send SMS' };
}

async function hashOtp(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + Deno.env.get('OTP_SECRET') || 'default-secret');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { phone_number, otp_code, purpose = 'verification' }: SendOtpRequest = await req.json();

    if (!phone_number || !otp_code) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone number and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanPhone = phone_number.replace(/\s/g, '').replace(/^0/, '+254');
    
    if (!/^\+254[0-9]{9}$/.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const otpHash = await hashOtp(otp_code);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data: session, error: sessionError } = await supabase
      .from('verification_sessions')
      .select('id')
      .eq('phone_number', cleanPhone)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (sessionError && sessionError.code !== 'PGRST116') {
      console.error('Session lookup error:', sessionError);
    }

    if (session) {
      await supabase
        .from('verification_sessions')
        .update({
          phone_number: cleanPhone,
          otp_hash: otpHash,
          otp_expires_at: expiresAt,
          otp_attempts: 0,
          otp_sent_at: new Date().toISOString(),
        })
        .eq('id', session.id);
    }

    const message = purpose === 'verification'
      ? `Your Savanah Dwelling verification code is: ${otp_code}. This code expires in 5 minutes.`
      : `Your Savanah Dwelling login code is: ${otp_code}. This code expires in 5 minutes.`;

    const smsProvider = Deno.env.get('SMS_PROVIDER') || 'africastalking';
    const smsResult = await sendSmsViaProvider(cleanPhone, message, smsProvider);

    if (!smsResult.success) {
      console.error('SMS send failed:', smsResult.error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: smsResult.error || 'Failed to send SMS',
          // For demo/development: still return success so UI can work
          ...(Deno.env.get('NODE_ENV') !== 'production' && { demo_mode: true, otp: otp_code })
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: smsResult.message_id,
        expires_at: expiresAt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
