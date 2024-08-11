import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  console.log(origin);
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-type,Authorization"
  );
  response.headers.set("Access-Control-Allow-Max-Age", "86400");
  console.log("Middleware called");
  console.log(req.nextUrl.pathname);
  console.log(req.method);
  console.log(req.url);
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
