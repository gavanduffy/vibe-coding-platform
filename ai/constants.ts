export enum Models {
  AnthropicClaudeOpus46 = 'anthropic/claude-opus-4.6',
  AnthropicClaudeSonnet46 = 'anthropic/claude-sonnet-4.6',
  OpenAIGPT53Codex = 'openai/gpt-5.3-codex',
}

export const DEFAULT_MODEL = Models.AnthropicClaudeOpus46

export const SUPPORTED_MODELS = [
  Models.AnthropicClaudeOpus46,
  Models.AnthropicClaudeSonnet46,
  Models.OpenAIGPT53Codex,
]

export const MODEL_NAMES: Record<string, string> = {
  [Models.AnthropicClaudeOpus46]: 'Claude Opus 4.6',
  [Models.AnthropicClaudeSonnet46]: 'Claude Sonnet 4.6',
  [Models.OpenAIGPT53Codex]: 'GPT-5.3 Codex',
}

export const MODEL_ALIASES: Record<string, Models> = {
  'claude-opus-4.6': Models.AnthropicClaudeOpus46,
  'claude opus 4.6': Models.AnthropicClaudeOpus46,
  'claude-sonnet-4.6': Models.AnthropicClaudeSonnet46,
  'claude sonnet 4.6': Models.AnthropicClaudeSonnet46,
  'gpt-5.3-codex': Models.OpenAIGPT53Codex,
  'gpt-5.3 codex': Models.OpenAIGPT53Codex,
}

export const TEST_PROMPTS = [
  'Generate an Expo Go-compatible iOS app for tracking workouts with tabs and local state',
  'Create a `golang` server that responds with "Hello World" to any request',
]
