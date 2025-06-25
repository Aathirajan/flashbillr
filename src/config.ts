// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Token expiration times (in minutes)
export const TOKEN_EXPIRY = {
  ACCESS: 15, // 15 minutes
  REFRESH: 7 * 24 * 60, // 7 days
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+{}|:<>?~',
};

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export const STORE_ADMIN_ROLES = [
  USER_ROLES.ADMIN,
  USER_ROLES.MANAGER,
  USER_ROLES.STAFF,
] as const;
