import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await UserService.getUser(email)
    if (existingUser) {
      return NextResponse.json({ error: 'Account already exists. Please sign in.' }, { status: 409 })
    }

    // Create new user
    const user = await UserService.createUser(email)

    // Create a simple session token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    const response = NextResponse.json({ 
      success: true, 
      user: { 
        email: user.email, 
        promptCount: user.promptCount,
        remainingPrompts: 5 - user.promptCount
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
