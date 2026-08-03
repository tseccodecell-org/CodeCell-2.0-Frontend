import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tseccodecell.com";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;

  if (!API_BASE) {
    return NextResponse.json(
      { error: "API base URL is not configured" },
      { status: 500 }
    );
  }

  const backendPath = `/${slug.join("/")}`;
  
  // FIX ISSUE 2: Explicitly validate and allow-list backend paths to prevent SSRF and path forwarding attacks
  const allowedPaths = [
    "/tsec_student/weekly_leaderboard",
    "/tsec_student/season_leaderboard",
    "/other/weekly_leaderboard",
    "/other/season_leaderboard"
  ];

  if (!allowedPaths.includes(backendPath)) {
    return NextResponse.json(
      { error: "Invalid leaderboard path requested" },
      { status: 400 }
    );
  }

  const search = req.nextUrl.searchParams.toString();
  const url = `${API_BASE}${backendPath}${search ? `?${search}` : ""}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // FIX ISSUE 4 (Partial applied here): Filter and sanitize request headers
  // Only forward exactly the auth token/cookie we expect
  const cookie = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");

  if (cookie) {
    // Basic sanitization: split and filter cookie string if needed, 
    // or just forward since it's an internal proxy, but avoid arbitrary header injection
    headers["Cookie"] = cookie;
  }
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  try {
    const upstream = await fetch(url, { headers, cache: "no-store" });
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
      { error: "Failed to reach backend server" },
      { status: 502 }
    );
  }
}
