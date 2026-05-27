import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { MODEL_ALIASES, Models } from './constants'
import type { JSONValue } from 'ai'
import type { OpenAIResponsesProviderOptions } from '@ai-sdk/openai'
import type { LanguageModelV3 } from '@ai-sdk/provider'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function resolveModel(modelId: string) {
  const trimmedModelId = modelId.trim()
  const normalizedModelId = trimmedModelId.toLowerCase()

  if (normalizedModelId.startsWith('openai/')) {
    const model = normalizedModelId.slice('openai/'.length)
    return {
      provider: 'openai' as const,
      model,
      modelId: `openai/${model}`,
    }
  }

  if (normalizedModelId.startsWith('anthropic/')) {
    const model = normalizedModelId.slice('anthropic/'.length)
    return {
      provider: 'anthropic' as const,
      model,
      modelId: `anthropic/${model}`,
    }
  }

  const resolvedId = MODEL_ALIASES[normalizedModelId] ?? trimmedModelId

  if (resolvedId === Models.OpenAIGPT53Codex) {
    return {
      provider: 'openai' as const,
      model: 'gpt-5.3-codex',
      modelId: Models.OpenAIGPT53Codex,
    }
  }

  if (
    resolvedId === Models.AnthropicClaudeSonnet46 ||
    resolvedId === Models.AnthropicClaudeOpus46
  ) {
    return {
      provider: 'anthropic' as const,
      model:
        resolvedId === Models.AnthropicClaudeSonnet46
          ? 'claude-sonnet-4.6'
          : 'claude-opus-4.6',
      modelId: resolvedId,
    }
  }

  throw new Error(`Unsupported model: ${trimmedModelId}`)
}

export interface ModelOptions {
  model: LanguageModelV3
  providerOptions?: Record<string, Record<string, JSONValue>>
  headers?: Record<string, string>
  modelId: string
}

export function getModelOptions(
  modelId: string,
  options?: { reasoningEffort?: 'low' | 'medium' | 'high' }
): ModelOptions {
  const resolvedModel = resolveModel(modelId)

  if (resolvedModel.provider === 'openai') {
    return {
      model: openai(resolvedModel.model),
      modelId: resolvedModel.modelId,
      providerOptions: {
        openai: {
          include: ['reasoning.encrypted_content'],
          reasoningEffort: options?.reasoningEffort ?? 'low',
          reasoningSummary: 'auto',
          serviceTier: 'priority',
        } satisfies OpenAIResponsesProviderOptions,
      },
    }
  }

  return {
    model: anthropic(resolvedModel.model),
    modelId: resolvedModel.modelId,
    headers: { 'anthropic-beta': 'fine-grained-tool-streaming-2025-05-14' },
    providerOptions: {
      anthropic: {
        cacheControl: { type: 'ephemeral' },
      },
    },
  }
}
