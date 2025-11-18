import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  
  // Don't redirect API routes
  if (isApiRoute) {
    return NextResponse.next()
  }
  
  // If user is not authenticated and trying to access protected pages, redirect to auth
  if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // If user is authenticated and on auth page, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
