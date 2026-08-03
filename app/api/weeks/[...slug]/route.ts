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

  // FIX ISSUE 3: Validate the slug to prevent path traversal/SSRF
  // Valid patterns: /weeks/[id] or /weeks/[id]/problems
  if (slug.length > 2 || (slug.length === 2 && slug[1] !== "problems")) {
    return NextResponse.json(
      { error: "Invalid week path requested" },
      { status: 400 }
    );
  }
  
  // Ensure the ID part only contains alphanumeric and dashes (standard UUID/slug)
  const idRegex = /^[a-zA-Z0-9-]+$/;
  if (!idRegex.test(slug[0])) {
    return NextResponse.json(
      { error: "Invalid week ID format" },
      { status: 400 }
    );
  }

  const backendPath = `/weeks/${slug.join("/")}`;
  const search = req.nextUrl.searchParams.toString();
  const url = `${API_BASE}${backendPath}${search ? `?${search}` : ""}`;

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
      { error: "Failed to reach backend server" },
      { status: 502 }
    );
  }
}
