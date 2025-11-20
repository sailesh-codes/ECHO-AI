import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isRegisterPage = request.nextUrl.pathname.startsWith('/register')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const publicAssets = ['/logo.png', '/favicon.ico', '/icon.svg', '/icon-dark-32x32.png', '/icon-light-32x32.png']

  // Don't redirect API routes
  if (isApiRoute) {
    return NextResponse.next()
  }

  if (publicAssets.some(asset => request.nextUrl.pathname === asset)) {
    return NextResponse.next()
  }
  
  // If user is not authenticated and trying to access protected pages, redirect to auth
  if (!token && !isAuthPage && !isRegisterPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // If user is authenticated and on auth/register page, redirect to home
  if (token && (isAuthPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|icon.svg|icon-dark-32x32.png|icon-light-32x32.png).*)']
}
