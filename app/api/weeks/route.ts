import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tseccodecell.com";

export async function GET(req: NextRequest) {
  const url = `${API_BASE}/weeks`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const cookie = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");

  if (cookie) headers["Cookie"] = cookie;
  if (authHeader) headers["Authorization"] = authHeader;

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
      { error: "Failed to fetch weeks from backend" },
      { status: 502 }
    );
  }
}
