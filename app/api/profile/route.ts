import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tseccodecell.com";

function forwardedHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };

  // FIX ISSUE 4: Filter and sanitize request headers explicitly instead of 
  // forwarding the raw cookie indiscriminately, preventing header-forwarding vulnerabilities.
  const cookieHeader = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");

  if (cookieHeader) {
    // Only extract expected cookies (e.g., jwt_token or session cookies)
    const cookies = cookieHeader.split(";").map(c => c.trim());
    const safeCookies = cookies.filter(c => c.startsWith("jwt_token=") || c.startsWith("session="));
    if (safeCookies.length > 0) {
      headers["Cookie"] = safeCookies.join("; ");
    }
  }

  if (authHeader) headers["Authorization"] = authHeader;

  return headers;
}

export async function GET(req: NextRequest) {
  try {
    const upstream = await fetch(`${API_BASE}/profile`, {
      headers: forwardedHeaders(req),
      cache: "no-store",
    });

    const bodyText = await upstream.text();

    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: { message: "Could not reach the server." } },
      { status: 502 }
    );
  }
}
