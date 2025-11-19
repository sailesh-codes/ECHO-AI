import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if session cookie already exists
    const existingSessionId = request.cookies.get('sessionId')?.value
    const existingPromptCount = request.cookies.get('promptCount')?.value

    if (existingSessionId && existingPromptCount) {
      // Session already exists, return existing data
      return NextResponse.json({ 
        success: true,
        sessionId: existingSessionId,
        promptCount: parseInt(existingPromptCount, 10),
        remainingPrompts: 5 - parseInt(existingPromptCount, 10)
      })
    }

    // Create new session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const initialPromptCount = 0

    const response = NextResponse.json({ 
      success: true,
      sessionId,
      promptCount: initialPromptCount,
      remainingPrompts: 5 - initialPromptCount
    })

    // Set session cookies
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    response.cookies.set('promptCount', initialPromptCount.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
