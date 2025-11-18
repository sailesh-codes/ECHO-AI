import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode token to get email
    const email = Buffer.from(token, 'base64').toString('utf-8').split(':')[0]

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await UserService.getUser(email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      user: {
        email: user.email,
        promptCount: user.promptCount,
        remainingPrompts: 5 - user.promptCount
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
