import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import type { JSONValue } from 'ai'
import type { LanguageModelV3 } from '@ai-sdk/provider'

const anthropic = createAnthropic({
  baseURL: process.env.ANTHROPIC_BASE_URL,
  apiKey: process.env.ANTHROPIC_API_KEY,
  headers: {
    'anthropic-beta': 'fine-grained-tool-streaming-2025-05-14',
  },
})

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ModelOptions {
  model: LanguageModelV3
  providerOptions?: Record<string, Record<string, JSONValue>>
}

export function getModelOptions(
  modelId: string,
  _options?: { reasoningEffort?: 'low' | 'medium' | 'high' }
): ModelOptions {
  if (modelId.startsWith('claude')) {
    return {
      model: anthropic(modelId) as unknown as LanguageModelV3,
      providerOptions: {
        anthropic: {
          cacheControl: { type: 'ephemeral' },
        },
      },
    }
  }

  return {
    model: openai(modelId) as unknown as LanguageModelV3,
  }
}
