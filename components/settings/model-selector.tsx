'use client'

import { SUPPORTED_MODELS, MODEL_NAMES } from '@/ai/constants'
import { cn } from '@/lib/utils'
import { useModelId } from './use-settings'

const DATALIST_ID = 'model-suggestions'

export function ModelSelector({ className }: { className?: string }) {
  const [modelId, setModelId] = useModelId()

  return (
    <>
      <datalist id={DATALIST_ID}>
        {SUPPORTED_MODELS.map((id) => (
          <option key={id} value={id}>
            {MODEL_NAMES[id] ?? id}
          </option>
        ))}
      </datalist>
      <input
        list={DATALIST_ID}
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        placeholder="Model name"
        className={cn(
          'h-9 w-40 rounded-sm border border-input bg-background px-3 py-1 font-mono text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className
        )}
      />
    </>
  )
}
