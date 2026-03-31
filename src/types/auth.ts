export type AppRole = 'tenant' | 'agent' | 'host' | 'professional' | 'admin';

export type VerificationStep = 'welcome' | 'id-upload' | 'selfie' | 'phone' | 'otp' | 'complete' | 'expired';

export interface RoleConfig {
  value: AppRole;
  label: string;
  desc: string;
  requiresVerification: boolean;
}

export const ROLE_CONFIG: Record<AppRole, RoleConfig> = {
  tenant: {
    value: 'tenant',
    label: 'Buyer / Renter',
    desc: 'Browse & save properties',
    requiresVerification: false,
  },
  agent: {
    value: 'agent',
    label: 'Real Estate Agent',
    desc: 'List & manage properties',
    requiresVerification: true,
  },
  host: {
    value: 'host',
    label: 'AirBnb Host',
    desc: 'List vacation & short-stay rentals',
    requiresVerification: true,
  },
  professional: {
    value: 'professional',
    label: 'Professional',
    desc: 'Offer property-related services',
    requiresVerification: true,
  },
  admin: {
    value: 'admin',
    label: 'Admin',
    desc: 'Platform administration',
    requiresVerification: false,
  },
};

export const VALID_ROLES: AppRole[] = ['tenant', 'agent', 'host', 'professional'];

export const VERIFICATION_ROLES: AppRole[] = ['agent', 'host', 'professional'];

export const ROLE_LABELS: Record<AppRole, string> = {
  tenant: 'Tenant / Buyer',
  agent: 'Real Estate Agent',
  host: 'Airbnb Host',
  professional: 'Professional',
  admin: 'Admin',
};

export const isValidRole = (role: string): role is AppRole => {
  return VALID_ROLES.includes(role as AppRole);
};

export const requiresVerification = (role: string): boolean => {
  return VERIFICATION_ROLES.includes(role as AppRole);
};
