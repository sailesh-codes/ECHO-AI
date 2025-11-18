import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const canPrompt = await UserService.canSendPrompt(email)
    const promptCount = await UserService.getPromptCount(email)

    if (!canPrompt) {
      return NextResponse.json({ 
        error: 'Prompt limit reached',
        promptCount,
        limit: 5
      }, { status: 403 })
    }

    // Increment prompt count
    await UserService.updateUserPromptCount(email)

    return NextResponse.json({ 
      success: true,
      remainingPrompts: 5 - promptCount - 1, // After increment
      promptCount: promptCount + 1
    })
  } catch (error) {
    console.error('Prompt check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
