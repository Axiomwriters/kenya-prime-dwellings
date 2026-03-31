-- Migration: Add OTP hash column and update role to include professional
-- This ensures OTP codes are stored as hashes, not plaintext

-- Add otp_hash column for secure OTP storage
ALTER TABLE verification_sessions 
ADD COLUMN IF NOT EXISTS otp_hash TEXT;

-- Add otp_sent_at to track when OTP was sent
ALTER TABLE verification_sessions 
ADD COLUMN IF NOT EXISTS otp_sent_at TIMESTAMPTZ;

-- Update role constraint to include professional
ALTER TABLE verification_sessions 
DROP CONSTRAINT IF EXISTS verification_sessions_role_check;

ALTER TABLE verification_sessions 
ADD CONSTRAINT verification_sessions_role_check 
CHECK (role IN ('agent', 'host', 'professional'));

-- Drop the old plaintext otp_code column (migration safety: only if exists)
-- Note: This is commented out for safety. Run manually after ensuring no production data depends on it
-- ALTER TABLE verification_sessions DROP COLUMN IF EXISTS otp_code;

-- Create index for otp_hash lookups (if needed)
CREATE INDEX IF NOT EXISTS idx_verification_sessions_phone_number 
ON verification_sessions(phone_number) 
WHERE phone_number IS NOT NULL;
