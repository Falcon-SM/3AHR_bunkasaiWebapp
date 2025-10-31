
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証情報 (環境変数から取得)
const USERNAME = process.env.ADMIN_USERNAME;
const PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * Basic認証ロジック
 */
export function middleware(request: NextRequest) {
  // 1. 認証情報をリクエストヘッダーから取得
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    // 2. Base64デコードとパース
    const authValue = basicAuth.split(' ')[1]; // "username:password" のBase64部分
    const [user, pass] = Buffer.from(authValue, 'base64').toString().split(':');

    // 3. 環境変数と認証情報を比較
    if (user === USERNAME && pass === PASSWORD) {
      const response = NextResponse.next();
      response.cookies.set({
        name: 'session',
        value: 'セッショントークン',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      return response;
    }
  }

  return new NextResponse('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="Private Area"`,
    },
  });
}

export const config = {
  matcher: ['/riddles/:path*', '/admin/:path*'], 
};