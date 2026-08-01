import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tseccodecell.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const cookie = req.headers.get("cookie");
    const authHeader = req.headers.get("authorization");
    if (cookie) headers["Cookie"] = cookie;
    if (authHeader) headers["Authorization"] = authHeader;

    const upstream = await fetch(`${API_BASE}/profile/complete`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const bodyText = await upstream.text();

    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Could not reach the server. Please try again." } },
      { status: 502 }
    );
  }
}
