# Echo - AI Assistant

A modern AI assistant application with multi-model support through OpenRouter and Google Gemini APIs.

## Features

- **Multiple AI Models**: Access to various AI models through OpenRouter's orchestration
- **Random Model Selection**: Automatically rotates between different models for variety
- **Clean Interface**: Modern, responsive UI with dark theme
- **Real-time Chat**: Interactive chat interface with message history
- **Code Generation**: Support for code-related queries and assistance

## Quick Start

### Prerequisites

- Node.js 18+ 
- OpenRouter API key
- Google Gemini API key (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd echo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Configuration

### OpenRouter API

OpenRouter provides access to multiple AI models through a unified API. Get your API key from [OpenRouter](https://openrouter.ai/keys).

### Google Gemini API

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Available Models

The application automatically rotates between these models:

### OpenRouter Models
- `openrouter/auto` - Automatic model selection
- `anthropic/claude-3-haiku` - Fast, efficient model
- `anthropic/claude-3.5-sonnet` - Balanced performance
- `openai/gpt-4o-mini` - Fast GPT-4 variant
- `openai/gpt-4o` - Full GPT-4 capabilities
- `google/gemini-flash-1.5` - Fast Gemini model
- `meta-llama/llama-3.1-8b-instruct` - Open source model
- `meta-llama/llama-3.2-3b-instruct` - Lightweight open source

### Gemini Models
- `gemini-2.0-flash` - Google's latest model

## Model Selection

The application uses automatic random model selection to provide variety in responses. Each message is processed by a different model from the available pool, ensuring diverse perspectives and capabilities.

## Error Handling

The application includes robust error handling with:
- Automatic fallback to reliable models
- Retry logic with exponential backoff
- Clear error messages and user feedback
- Model validation and auto-correction

## Rate Limits

- **OpenRouter**: Follows OpenRouter's rate limits based on your plan
- **Gemini**: Follows Google's API rate limits

## Development

### Project Structure

```
├── app/
│   ├── actions.ts          # API integration functions
│   ├── api/
│   │   └── openrouter/     # OpenRouter API endpoint
│   ├── page.tsx           # Main application component
│   └── layout.tsx         # App layout
├── components/
│   ├── sidebar.tsx        # Navigation sidebar
│   ├── chat-window.tsx    # Chat interface
│   └── info-modal.tsx     # Information modal
└── README.md
```

### Adding New Models

To add new models to the random selection:

1. Update the `availableModels` array in `app/page.tsx`
2. Add the model to `APPROVED_MODELS` in `app/actions.ts`
3. Update the README documentation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Optional |

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API keys are correctly set in `.env.local`
2. **Rate Limits**: Wait before making additional requests if you hit rate limits
3. **Model Errors**: The app automatically falls back to working models

### Debug Mode

Check the browser console for detailed information about:
- Which model is being used for each request
- API response times
- Error details

## License

This project is licensed under the MIT License.
