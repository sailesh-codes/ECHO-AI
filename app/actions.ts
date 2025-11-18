'use server'

import { UserService } from '@/lib/user-service'

export async function generateAIResponse(userMessage: string, userEmail: string) {
  try {
    // Check prompt limit directly using UserService
    const canPrompt = await UserService.canSendPrompt(userEmail)
    const promptCount = await UserService.getPromptCount(userEmail)

    if (!canPrompt) {
      throw new Error(`Prompt limit reached. You have used ${promptCount}/5 prompts.`)
    }

    // Increment prompt count
    await UserService.updateUserPromptCount(userEmail)

    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set')
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Gemini API error:', errorData)
        throw new Error(`API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      const assistantContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received'
      
      return assistantContent
    } catch (error: any) {
      console.error('Gemini API call failed:', error)
      throw new Error(error.message || 'Failed to generate AI response')
    }
  } catch (error: any) {
    console.error('generateAIResponse error:', error)
    throw new Error(error.message || 'Failed to generate AI response')
  }
}

export async function generateMistralResponse(userMessage: string, userEmail: string) {
  try {
    // Check prompt limit directly using UserService
    const canPrompt = await UserService.canSendPrompt(userEmail)
    const promptCount = await UserService.getPromptCount(userEmail)

    if (!canPrompt) {
      throw new Error(`Prompt limit reached. You have used ${promptCount}/5 prompts.`)
    }

    // Increment prompt count
    await UserService.updateUserPromptCount(userEmail)

    const apiKey = process.env.MISTRAL_API_KEY
    
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY environment variable is not set')
    }

    try {
      const url = 'https://api.mistral.ai/v1/chat/completions'
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 1024,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Mistral API error:', errorData)
        throw new Error(`API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      const assistantContent = data?.choices?.[0]?.message?.content || 'No response received'
      
      return assistantContent
    } catch (error: any) {
      console.error('Mistral API call failed:', error)
      throw new Error(error.message || 'Failed to generate Mistral response')
    }
  } catch (error: any) {
    console.error('generateMistralResponse error:', error)
    throw new Error(error.message || 'Failed to generate Mistral response')
  }
}
