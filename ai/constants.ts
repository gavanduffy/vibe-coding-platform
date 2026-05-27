export enum Models {
  AnthropicClaudeOpus46 = 'claude-opus-4-5',
  AnthropicClaudeSonnet46 = 'claude-sonnet-4-5',
  OpenAIGPT4o = 'gpt-4o',
}

export const DEFAULT_MODEL = Models.AnthropicClaudeOpus46

export const SUPPORTED_MODELS: string[] = [
  Models.AnthropicClaudeOpus46,
  Models.AnthropicClaudeSonnet46,
  Models.OpenAIGPT4o,
]

export const MODEL_NAMES: Record<string, string> = {
  [Models.AnthropicClaudeOpus46]: 'Claude Opus 4.5',
  [Models.AnthropicClaudeSonnet46]: 'Claude Sonnet 4.5',
  [Models.OpenAIGPT4o]: 'GPT-4o',
}

export const TEST_PROMPTS = [
  'Build me a task manager iOS app with tabs for Today and All Tasks',
  'Create an Expo app with a home screen showing a list of items from Supabase',
]
