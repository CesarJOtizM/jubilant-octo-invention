import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/app/api/auth/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationSlug, email, password } = body;

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Organization-Slug": organizationSlug,
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    const {
      refreshToken,
      accessToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      ...rest
    } = result.data;

    // Store refresh token in HttpOnly cookie (protected from JS access)
    // Access token is returned to the browser for API requests to the backend
    // Cookie maxAge is derived from the backend-issued expiry timestamps so
    // the browser keeps the cookies alive exactly as long as the JWT is valid.
    await setAuthCookies(
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    );

    // Return data WITH accessToken + accessTokenExpiresAt (needed by the
    // browser TokenService to schedule refresh) but WITHOUT refreshToken.
    return NextResponse.json({
      ...result,
      data: { ...rest, accessToken, accessTokenExpiresAt },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
