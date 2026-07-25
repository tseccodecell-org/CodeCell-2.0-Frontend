import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api-client";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token");

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Cookie: `jwt_token=${token.value}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: "Failed to fetch profile from backend" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
