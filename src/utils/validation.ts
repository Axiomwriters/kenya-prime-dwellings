export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain a number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Must contain a special character');
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    strength = 'strong';
  } else if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; formatted: string } => {
  const cleanPhone = phone.replace(/\s/g, '').replace(/^0/, '+254');
  const isValid = /^\+254[0-9]{9}$/.test(cleanPhone);
  return {
    isValid,
    formatted: cleanPhone,
  };
};

export const formatPhoneNumber = (phone: string): string => {
  const clean = phone.replace(/\D/g, '').slice(0, 9);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
};
