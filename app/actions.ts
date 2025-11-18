'use server'

export async function generateAIResponse(userMessage: string) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      throw new Error(`API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    const assistantContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received'

    return assistantContent
  } catch (error: any) {
    throw new Error(error.message || 'Failed to generate AI response')
  }
}

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY_BASE = 1000 // 1 second base delay

// Approved model list for validation (Tested Working Models)
const APPROVED_MODELS = [
  'distilbert/distilgpt2',
  'openai-community/gpt2',
  'bigcode/tiny_starcoder_py',
  'codeparrot/codeparrot-small',
  'microsoft/DialoGPT-medium',
  'microsoft/DialoGPT-small'
]

export async function generateHFResponse(modelId: string, userInput: string) {
  const apiKey = process.env.HF_API_KEY

  if (!apiKey) {
    throw new Error('HF_API_KEY environment variable is not set')
  }

  // Sanitize inputs
  if (!modelId || typeof modelId !== 'string' || modelId.trim().length === 0) {
    throw new Error('Invalid model ID: Model ID must be a non-empty string')
  }

  if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
    throw new Error('Invalid input: User input must be a non-empty string')
  }

  // Clean and validate model ID format
  const cleanModelId = modelId.trim()
  const cleanUserInput = userInput.trim()

  // Basic model ID validation (allow both organization/model and model-only formats)
  if (!cleanModelId || cleanModelId.length === 0) {
    throw new Error('Invalid model ID format. Model ID cannot be empty')
  }
  
  // If it contains a slash, ensure it's in the correct organization/model format
  if (cleanModelId.includes('/') && cleanModelId.split('/').length !== 2) {
    throw new Error('Invalid model ID format. Expected format: organization/model-name')
  }

  // Validate model against approved list (allow custom models with warning)
  if (!APPROVED_MODELS.includes(cleanModelId)) {
    console.warn(`Using unapproved model: ${cleanModelId}. This may not work or could be slower.`)
  }

  try {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const url = `https://router.huggingface.co/hf-inference`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: cleanModelId,
            inputs: cleanUserInput,
            parameters: {
              max_new_tokens: 1024,
              temperature: 0.7,
              do_sample: true,
              return_full_text: false,
            }
          })
        })

        if (!response.ok) {
          const errorData = await response.text()
          
          // Log full API response for debugging
          console.error('Hugging Face API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            modelId: cleanModelId,
            attempt
          })
          
          // Handle specific HTTP error codes with user-friendly messages
          switch (response.status) {
            case 400:
              throw new Error('Bad request: The model or input format is invalid. Please check your model name and try again.')
            
            case 401:
              throw new Error('Authentication failed: Check your Hugging Face API token. Ensure it has read permissions.')
            
            case 403:
              throw new Error('Access denied: The API token does not have permission to access this model.')
            
            case 404:
              const fallbackModel = 'distilbert/distilgpt2'
              throw new Error(`Model not found: The model "${cleanModelId}" does not exist or is not available through the Inference API. Please: 1) Check the model ID spelling, 2) Ensure the model supports inference API, 3) Try "${fallbackModel}" which is known to work reliably.`)
            
            case 410:
              throw new Error('API endpoint deprecated: You are using an outdated API endpoint. Please update your application.')
            
            case 429:
              if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1) // Exponential backoff
                console.log(`Rate limit hit. Retrying in ${delay}ms... (attempt ${attempt}/${MAX_RETRIES})`)
                await new Promise(resolve => setTimeout(resolve, delay))
                continue // Retry this attempt
              }
              throw new Error('Rate limit exceeded: You have hit the rate limit. Please wait a moment before trying again.')
            
            case 500:
              if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1)
                console.log(`Server error. Retrying in ${delay}ms... (attempt ${attempt}/${MAX_RETRIES})`)
                await new Promise(resolve => setTimeout(resolve, delay))
                continue
              }
              throw new Error('Internal server error: Hugging Face is experiencing issues. Please try again later.')
            
            case 503:
              if (attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1)
                console.log(`Model loading. Retrying in ${delay}ms... (attempt ${attempt}/${MAX_RETRIES})`)
                await new Promise(resolve => setTimeout(resolve, delay))
                continue
              }
              throw new Error('Model loading: The model is currently loading. Please wait a moment and try again.')
            
            default:
              throw new Error(`Hugging Face API error (${response.status}): ${errorData || 'Unknown error occurred'}`)
          }
        }

        // If we got here, the request was successful
        const data = await response.json()
        
        // Handle different response formats from different models
        let generatedText = ''
        
        if (Array.isArray(data) && data.length > 0) {
          // Most text generation models return an array
          generatedText = data[0]?.generated_text || ''
        } else if (data?.generated_text) {
          // Some models return a single object
          generatedText = data.generated_text
        } else if (data?.[0]?.generated_text) {
          // Another possible format
          generatedText = data[0].generated_text
        } else {
          throw new Error('Unexpected response format from Hugging Face API')
        }

        // Clean up the response - remove the input if it's included
        if (generatedText.startsWith(cleanUserInput)) {
          generatedText = generatedText.substring(cleanUserInput.length).trim()
        }

        return generatedText || 'No response received'

      } catch (error: any) {
        lastError = error
        if (attempt === MAX_RETRIES) {
          throw error // Re-throw the last error on final attempt
        }
        // Continue to next attempt for retryable errors
        if (error.message.includes('Rate limit') || error.message.includes('loading') || error.message.includes('server error')) {
          continue
        }
        throw error // Non-retryable error, throw immediately
      }
    }
    
    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Failed to generate response after retries')
  } catch (error: any) {
    throw new Error(error.message || 'Failed to generate response from Hugging Face model')
  }
}
