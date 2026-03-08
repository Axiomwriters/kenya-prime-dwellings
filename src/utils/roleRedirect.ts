
import { AppRole } from '@/utils/AuthRedirectHandler';

const PROFESSIONAL_ROLES = new Set(['agent', 'host', 'airbnb host', 'professional']);

export function resolveDashboard(role: string | null | undefined): '/dashboard' | '/professionalDashboard' | '/dashboard/agent' | '/dashboard/short-stay' {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'agent') {
    return '/dashboard/agent';
  }

  if (normalizedRole === 'host') {
    return '/dashboard/short-stay';
  }

  if (!normalizedRole) {
    return '/dashboard';
  }

  return PROFESSIONAL_ROLES.has(normalizedRole) ? '/professionalDashboard' : '/dashboard';
}

export function resolveRoleFromMetadata(role: AppRole): '/dashboard' | '/professionalDashboard' | '/dashboard/admin' | '/dashboard/agent' | '/dashboard/short-stay' {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'admin') {
    return '/dashboard/admin';
  }

  return resolveDashboard(normalizedRole);
}
