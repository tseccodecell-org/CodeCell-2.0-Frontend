import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tseccodecell.com";

function forwardedHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };

  const cookie = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");

  if (cookie) headers["Cookie"] = cookie;
  if (authHeader) headers["Authorization"] = authHeader;

  return headers;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const { notificationId } = await params;

  try {
    const upstream = await fetch(
      `${API_BASE}/notifications/${encodeURIComponent(notificationId)}/seen`,
      {
        method: "POST",
        headers: forwardedHeaders(req),
        cache: "no-store",
      }
    );

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
