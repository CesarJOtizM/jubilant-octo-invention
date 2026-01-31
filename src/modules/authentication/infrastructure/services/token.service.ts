import { env } from '@/config/env';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

const TOKEN_KEY = env.NEXT_PUBLIC_AUTH_COOKIE_NAME;
const REFRESH_TOKEN_KEY = env.NEXT_PUBLIC_REFRESH_COOKIE_NAME;
const ORG_SLUG_KEY = 'nevada_org_slug';
const USER_KEY = 'nevada_user';

export interface StoredUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export class TokenService {
  static setTokens(tokens: StoredTokens): void {
    if (!isClient()) return;

    try {
      localStorage.setItem(TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      localStorage.setItem(`${TOKEN_KEY}_expires`, tokens.expiresAt);
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  static getAccessToken(): string | null {
    if (!isClient()) return null;

    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static getRefreshToken(): string | null {
    if (!isClient()) return null;

    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static getTokenExpiry(): Date | null {
    if (!isClient()) return null;

    try {
      const expiresAt = localStorage.getItem(`${TOKEN_KEY}_expires`);
      return expiresAt ? new Date(expiresAt) : null;
    } catch {
      return null;
    }
  }

  static isTokenExpired(): boolean {
    const expiresAt = this.getTokenExpiry();
    if (!expiresAt) return true;
    return new Date() >= expiresAt;
  }

  static isTokenAboutToExpire(thresholdMs: number = 60000): boolean {
    const expiresAt = this.getTokenExpiry();
    if (!expiresAt) return true;
    const timeUntilExpiry = expiresAt.getTime() - Date.now();
    return timeUntilExpiry <= thresholdMs;
  }

  static clearTokens(): void {
    if (!isClient()) return;

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(`${TOKEN_KEY}_expires`);
      localStorage.removeItem(ORG_SLUG_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  static setUser(user: StoredUser): void {
    if (!isClient()) return;

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  }

  static getUser(): StoredUser | null {
    if (!isClient()) return null;

    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static setOrganizationSlug(slug: string): void {
    if (!isClient()) return;

    try {
      localStorage.setItem(ORG_SLUG_KEY, slug);
    } catch (error) {
      console.error('Failed to store organization slug:', error);
    }
  }

  static getOrganizationSlug(): string | null {
    if (!isClient()) return null;

    try {
      return localStorage.getItem(ORG_SLUG_KEY);
    } catch {
      return null;
    }
  }

  static hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }
}
