import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get user data from cookies
    const userName = request.cookies.get('userName')?.value
    const chatCount = parseInt(request.cookies.get('chatCount')?.value || '0', 10)
    const remainingPrompts = 5 - chatCount

    return NextResponse.json({
      success: true,
      userName,
      chatCount,
      remainingPrompts,
      isLoggedIn: !!userName
    })
  } catch (error) {
    console.error('Auth status error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to get auth status' 
    }, { status: 500 })
  }
}
