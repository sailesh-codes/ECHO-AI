# AI Code Editor

A modern AI-powered code editor with support for multiple AI providers including Hugging Face Inference API and Google Gemini.

## Features

- **Multiple AI Providers**: Switch between Hugging Face and Google Gemini
- **Model Selection**: Choose from various pre-configured Hugging Face models
- **Code Generation**: Generate code with specialized models like StarCoder and Codestral
- **Chat Interface**: Interactive chat with AI assistants
- **Modern UI**: Black and aqua theme with responsive design
- **Error Handling**: Comprehensive error handling for API rate limits and failures

## Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Get your API keys:
   - **Hugging Face**: Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - **Google Gemini**: Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

3. Update your `.env` file with your API keys:
   ```env
   # Hugging Face API Configuration
   HF_API_KEY=your-hugging-face-api-key-here

   # Google Gemini API Configuration (optional)
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Switching AI Providers

1. Open the sidebar
2. Use the AI Provider toggle to switch between:
   - **HF (Hugging Face)**: Access to various open-source models
   - **Gemini**: Google's Gemini model

### Selecting Hugging Face Models

When using Hugging Face provider:
1. Click on the model selector in the sidebar
2. Choose from available models:
   - **StarCoder**: Code generation model
   - **Codestral**: Advanced code generation
   - **Llama 3 8B**: General purpose model
   - **Phi-3 Mini**: Lightweight instruction model
   - **Gemma 7B**: Google's lightweight model
   - **Zephyr 7B**: Helpful instruction model

### Chat Features

- **Copy Messages**: Click the copy button on any message to copy it to clipboard
- **Clear History**: Use the "Clear Chat History" button to reset the conversation
- **Stop Generation**: Click the stop button to interrupt AI responses

## Available Models

### Basic Models (Tested Working)
- `distilbert/distilgpt2` - Lightweight GPT-2 model - reliable and fast
- `openai-community/gpt2` - Original GPT-2 model - very reliable

### Code Models (Tested Working)
- `bigcode/tiny_starcoder_py` - Lightweight code model - works reliably
- `codeparrot/codeparrot-small` - Small code generation model

### Chat Models (Tested Working)
- `microsoft/DialoGPT-medium` - Conversational model - tested working
- `microsoft/DialoGPT-small` - Lightweight conversational model

### Custom Models
- **Enter any Hugging Face model ID**: Use the "Custom Model" option to enter any public Hugging Face model repository ID
- **Format**: `organization/model-name` (e.g., `microsoft/DialoGPT-medium`)
- **Access**: Works with any public model available on Hugging Face

### Model Categories
- **Code** (Cyan): Specialized for code generation and understanding
- **General** (Purple): Multi-purpose models for various tasks
- **Chat** (Green): Optimized for conversation and dialogue
- **Custom** (Orange): User-specified models

## API Integration

### Hugging Face Inference API

The application uses Hugging Face's new unified router endpoint for all inference requests:

#### Endpoint Configuration
- **URL**: `https://router.huggingface.co/hf-inference`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <HF_API_KEY>`

#### Request Format
```json
{
  "model": "meta-llama/Meta-Llama-3-8B-Instruct",
  "inputs": "Your prompt here",
  "parameters": {
    "max_new_tokens": 1024,
    "temperature": 0.7,
    "do_sample": true,
    "return_full_text": false
  }
}
```

#### Error Handling
The application handles the following HTTP error codes with user-friendly messages:

- **400**: Bad request - Invalid model or input format
- **401**: Authentication failed - Check API token permissions
- **403**: Access denied - Token lacks model permissions
- **404**: Model not found - Incorrect model ID
- **410**: Deprecated endpoint - Update API configuration
- **429**: Rate limit exceeded - Wait and retry (automatic retry enabled)
- **500**: Server error - HF service issues (automatic retry enabled)
- **503**: Model loading - Model is loading (automatic retry enabled)

#### Retry Logic
The application implements automatic retries with exponential backoff for:
- Rate limit errors (429)
- Server errors (500)
- Model loading errors (503)

Maximum retries: 3 with exponential backoff (1s, 2s, 4s delays)

#### Model Validation
All models are validated against an approved list. Custom models are allowed but logged as warnings.

Approved Models (Tested Working):
- `distilbert/distilgpt2`
- `openai-community/gpt2`
- `bigcode/tiny_starcoder_py`
- `codeparrot/codeparrot-small`
- `microsoft/DialoGPT-medium`
- `microsoft/DialoGPT-small`

## Rate Limits

- **Hugging Face**: Free tier has rate limits. If you encounter rate limit errors, wait a moment before trying again.
- **Gemini**: Follows Google's API rate limits.

## Error Handling

The application includes comprehensive error handling for:
- API rate limits (429 errors)
- Model loading (503 errors)
- Deprecated endpoints (410 errors)
- Invalid model IDs or authentication (401/404 errors)
- Network connectivity issues

### Common Error Messages:
- **Rate limit exceeded**: Wait a moment before trying again
- **Model loading**: Model is being prepared, please retry
- **Endpoint deprecated**: Configuration needs updating
- **Authentication failed**: Check your API key

## Development

### Project Structure

```
├── app/                 # Next.js app directory
│   ├── actions.ts      # Server actions for API calls
│   ├── page.tsx        # Main page component
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── model-selector.tsx  # Model selection dropdown
│   ├── sidebar.tsx         # Application sidebar
│   ├── chat-window.tsx     # Chat interface
│   └── ui/                 # UI components
├── hooks/              # Custom React hooks
└── styles/             # CSS files
```

### Adding New Models

To add a new Hugging Face model:

1. Update the `hfModels` array in `components/model-selector.tsx`
2. Add the model configuration:
   ```typescript
   {
     id: 'organization/model-name',
     name: 'Display Name',
     description: 'Model description',
     category: 'code' | 'text' | 'general',
     icon: <ComponentIcon />
   }
   ```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
