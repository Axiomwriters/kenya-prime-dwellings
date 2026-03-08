import { resolveRoleFromMetadata } from '@/utils/roleRedirect';

export type AppRole = 'agent' | 'host' | 'professional' | 'tenant' | 'buyer' | 'admin' | null | undefined;

export function resolveRedirect(role: AppRole): string {
  return resolveRoleFromMetadata(role);
}

export function isProfessionalTier(role: AppRole): boolean {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === 'agent' || normalizedRole === 'host' || normalizedRole === 'professional' || normalizedRole === 'admin';
}
