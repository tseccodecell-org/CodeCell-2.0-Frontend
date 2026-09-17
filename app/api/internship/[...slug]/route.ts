import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tseccodecell.com";

function backendPathFor(slug: string[]): string {
  return `/api/internship/${slug.join("/")}`;
}

function forwardedHeaders(req: NextRequest, withBody: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (withBody) headers["Content-Type"] = "application/json";

  const cookie = req.headers.get("cookie");
  const authHeader = req.headers.get("authorization");

  if (cookie) headers["Cookie"] = cookie;
  if (authHeader) headers["Authorization"] = authHeader;

  return headers;
}

function relayResponse(bodyText: string, status: number) {
  return new NextResponse(bodyText, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function unreachableResponse() {
  return NextResponse.json(
    { success: false, error: { message: "Could not reach the server. Please try again." } },
    { status: 502 }
  );
}

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

  const url = `${API_BASE}${backendPathFor(slug)}`;

  try {
    const upstream = await fetch(url, {
      headers: forwardedHeaders(req, false),
      cache: "no-store",
    });
    const bodyText = await upstream.text();
    return relayResponse(bodyText, upstream.status);
  } catch {
    return unreachableResponse();
  }
}

export async function POST(
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

  const url = `${API_BASE}${backendPathFor(slug)}`;

  try {
    const body = await req.text();
    const upstream = await fetch(url, {
      method: "POST",
      headers: forwardedHeaders(req, true),
      body,
    });
    const bodyText = await upstream.text();
    return relayResponse(bodyText, upstream.status);
  } catch {
    return unreachableResponse();
  }
}

