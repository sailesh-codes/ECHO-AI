import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Valid name is required (min 2 characters)' }, { status: 400 })
    }

    const response = NextResponse.json({ 
      success: true, 
      user: { 
        name: name.trim(), 
        chatCount: 0,
        remainingPrompts: 5
      }
    })

    // Set cookies for user name and chat count
    response.cookies.set('userName', name.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    response.cookies.set('chatCount', '0', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
