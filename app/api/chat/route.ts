import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, generateMistralResponse } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    const { message, provider } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check session cookies
    const sessionId = request.cookies.get('sessionId')?.value
    const promptCount = parseInt(request.cookies.get('promptCount')?.value || '0', 10)

    if (!sessionId) {
      return NextResponse.json({ error: 'No active session found' }, { status: 401 })
    }

    // Check if user has reached the limit
    if (promptCount >= 5) {
      return NextResponse.json({ 
        error: 'Chat limit reached (5 messages)',
        remainingPrompts: 0 
      }, { status: 403 })
    }

    // Generate AI response
    let response: string
    try {
      if (provider === 'mistral') {
        response = await generateMistralResponse(message)
      } else {
        response = await generateAIResponse(message)
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      return NextResponse.json({ 
        error: 'Failed to generate AI response',
        details: aiError instanceof Error ? aiError.message : 'Unknown error'
      }, { status: 500 })
    }

    // Increment prompt count
    const newPromptCount = promptCount + 1
    const remainingPrompts = 5 - newPromptCount

    const apiResponse = NextResponse.json({
      success: true,
      response,
      provider,
      promptCount: newPromptCount,
      remainingPrompts
    })

    // Update the promptCount cookie
    apiResponse.cookies.set('promptCount', newPromptCount.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return apiResponse
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current chat status from cookies
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
    console.error('Chat status error:', error)
    return NextResponse.json({ error: 'Failed to get chat status' }, { status: 500 })
  }
}
