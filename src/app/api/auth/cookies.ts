import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "nevada_access_token";
const REFRESH_TOKEN_COOKIE = "nevada_refresh_token";

const isProduction = process.env.NODE_ENV === "production";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Converts an ISO date string (or Date) into a cookie `maxAge` value (in seconds)
 * relative to `now`. Guarantees a minimum of 1 second so the browser never
 * interprets the cookie as a "session cookie" due to a negative maxAge.
 */
function computeMaxAgeSeconds(
  expiresAt: string | Date | undefined | null,
): number | null {
  if (!expiresAt) return null;
  const expiryDate =
    expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  const expiryMs = expiryDate.getTime();
  if (Number.isNaN(expiryMs)) return null;
  const deltaSeconds = Math.floor((expiryMs - Date.now()) / 1000);
  return deltaSeconds > 0 ? deltaSeconds : 1;
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  accessTokenExpiresAt: string | Date,
  refreshTokenExpiresAt: string | Date,
) {
  const accessMaxAge = computeMaxAgeSeconds(accessTokenExpiresAt);
  const refreshMaxAge = computeMaxAgeSeconds(refreshTokenExpiresAt);

  if (accessMaxAge === null || refreshMaxAge === null) {
    throw new Error(
      "setAuthCookies: invalid or missing token expiry dates from backend",
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    cookieOptions(accessMaxAge),
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    cookieOptions(refreshMaxAge),
  );
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, "", { ...cookieOptions(0), maxAge: 0 });
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
    ...cookieOptions(0),
    maxAge: 0,
  });
}

export async function getAccessTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}
