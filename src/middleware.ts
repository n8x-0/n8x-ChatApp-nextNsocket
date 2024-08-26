import { cookies } from 'next/headers';
import * as jose from 'jose'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookie = cookies().get("token");
  if (!cookie || cookie.value === '') {
    console.log('middleware: nocookie regiestered');
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const secret = new TextEncoder().encode(process.env.JWT_TOKEN)
  const jwt = cookie.value

  try {
    const { payload } = await jose.jwtVerify(jwt, secret, {})
    // console.log(payload);
    return NextResponse.next()
  } catch (err) {
    console.log("middleware:", err);
    return NextResponse.redirect(new URL('/login', request.url))
  }

}

export const config = {
  matcher: ['/profile/:path*', '/users/:path*', '/chats/:path*', '/[...chatId]/:path*'],
}