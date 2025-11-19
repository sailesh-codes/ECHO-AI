import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, generateMistralResponse } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    const { message, provider } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get chat count from cookies
    const chatCount = parseInt(request.cookies.get('chatCount')?.value || '0', 10)

    // Check if user has reached the limit
    if (chatCount >= 5) {
      return NextResponse.json({ 
        error: 'Chat limit reached (5 messages)',
        remainingPrompts: 0 
      }, { status: 403 })
    }

    // Generate AI response based on provider
    let response: string
    if (provider === 'mistral') {
      response = await generateMistralResponse(message)
    } else {
      response = await generateAIResponse(message)
    }

    // Increment chat count and set new cookie
    const newChatCount = chatCount + 1
    const remainingPrompts = 5 - newChatCount

    const apiResponse = NextResponse.json({
      success: true,
      response,
      chatCount: newChatCount,
      remainingPrompts
    })

    apiResponse.cookies.set('chatCount', newChatCount.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return apiResponse
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process chat message' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current chat status from cookies
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
    console.error('Chat status error:', error)
    return NextResponse.json({ error: 'Failed to get chat status' }, { status: 500 })
  }
}
