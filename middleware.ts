
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("jwt_token")?.value;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/events/weekly-challenges/")
  ) 
  return NextResponse.next();
}