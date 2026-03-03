export class OpenRouterAPI {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }
  }

  async generateText(prompt: string, options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    const model = options?.model || 'openai/gpt-3.5-turbo';
    const temperature = options?.temperature || 0.7;
    const maxTokens = options?.maxTokens || 1024;

    console.log('OpenRouter API Request:', {
      url: `${this.baseURL}/chat/completions`,
      model,
      temperature,
      maxTokens,
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey.length
    });

    try {
      const response = await fetch(
        `${this.baseURL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature,
            max_tokens: maxTokens,
          })
        }
      );

      console.log('OpenRouter API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      console.log('OpenRouter API Success Response:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        firstChoice: data.choices?.[0]
      });
      
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }
}

export const openRouterAPI = new OpenRouterAPI();
