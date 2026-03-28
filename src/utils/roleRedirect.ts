
export type AppRole = 'admin' | 'agent' | 'host' | 'professional' | 'tenant' | null | undefined;

const PROFESSIONAL_ROLES = new Set(['agent', 'host', 'airbnb host', 'professional']);

export const isProfessionalTier = (role: AppRole): boolean => {
    if (!role) return false;
    const normalizedRole = role.trim().toLowerCase();
    return PROFESSIONAL_ROLES.has(normalizedRole);
};

export function resolveDashboard(role: string | null | undefined): '/dashboard' | '/professionalDashboard' | '/agent/dashboard' | '/dashboard/short-stay' {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'agent') {
    return '/agent/dashboard';
  }

  if (normalizedRole === 'host') {
    return '/dashboard/short-stay';
  }

  if (!normalizedRole) {
    return '/dashboard';
  }

  return PROFESSIONAL_ROLES.has(normalizedRole) ? '/professionalDashboard' : '/dashboard';
}

export function resolveRoleFromMetadata(role: AppRole): '/dashboard' | '/professionalDashboard' | '/admin' | '/agent/dashboard' | '/dashboard/short-stay' {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'admin') {
    return '/admin';
  }

  return resolveDashboard(normalizedRole);
}
