import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Decode token to get email (simple approach for demo)
    const email = Buffer.from(token, 'base64').toString('utf-8').split(':')[0]

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
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
      promptCount: promptCount + 1,
      remainingPrompts: 5 - (promptCount + 1)
    })
  } catch (error) {
    console.error('Prompt check error:', error)
    return NextResponse.json({ error: 'Failed to check prompt limit' }, { status: 500 })
  }
}
