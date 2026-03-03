'use server'

import { openRouterAPI } from '@/lib/openrouter'

export async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const response = await openRouterAPI.generateText(userMessage, {
      model: 'openai/gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 1024
    })
    return response
  } catch (error: any) {
    console.error('OpenRouter API call failed:', error)
    throw new Error(error.message || 'Failed to generate AI response')
  }
}

export async function generateMistralResponse(userMessage: string): Promise<string> {
  try {
    const response = await openRouterAPI.generateText(userMessage, {
      model: 'mistralai/mistral-7b-instruct',
      temperature: 0.7,
      maxTokens: 1024
    })
    return response
  } catch (error: any) {
    console.error('OpenRouter API call failed:', error)
    throw new Error(error.message || 'Failed to generate Mistral response')
  }
}
