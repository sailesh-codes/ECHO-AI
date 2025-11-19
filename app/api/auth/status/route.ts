import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get session data from cookies
    const sessionId = request.cookies.get('sessionId')?.value
    const promptCount = parseInt(request.cookies.get('promptCount')?.value || '0', 10)
    const remainingPrompts = 5 - promptCount

    return NextResponse.json({
      success: true,
      sessionId,
      promptCount,
      remainingPrompts,
      isLoggedIn: !!sessionId
    })
  } catch (error) {
    console.error('Auth status error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to get auth status' 
    }, { status: 500 })
  }
}
