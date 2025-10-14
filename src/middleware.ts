// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server'; 

export function middleware(request: NextRequest) {
  // Middleware のロジック本体を記述する
  console.log('Middlewareが実行されました:', request.nextUrl.pathname);
  return NextResponse.next(); // 以降の処理を継続する
}

// Middlewareを実行するパスを指定
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

{/*

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes, static files, and auth pages
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/auth/") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  // セッション認証チェック
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.next() // クライアントサイドで認証処理
  }

  const payload = await verifyToken(token)
  if (!payload || payload.type !== "session") {
    const response = NextResponse.next()
    response.cookies.delete("auth-token")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
*/}