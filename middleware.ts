
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("jwt_token")?.value;

  // console.log("PATH:", pathname);
  // console.log("TOKEN:", token);

  if (
  pathname.startsWith("/admin") ||
  pathname.startsWith("/dashboard") //||
  // pathname.startsWith("/events/weekly-challenges/")
) {
  if (!token) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

  return NextResponse.next();
}