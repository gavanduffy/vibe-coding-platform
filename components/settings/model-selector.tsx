'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { useAvailableModels } from './use-available-models'
import { useModelId } from './use-settings'

export function ModelSelector({ className }: { className?: string }) {
  const [modelId, setModelId] = useModelId()
  const { models: available } = useAvailableModels()
  const models = useMemo(
    () => available?.sort((a, b) => a.label.localeCompare(b.label)) || [],
    [available]
  )

  return (
    <>
      <Input
        className={cn('w-[220px] bg-background', className)}
        list="available-models"
        onChange={(event) => setModelId(event.target.value)}
        placeholder="Model name"
        value={modelId}
      />
      <datalist id="available-models">
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </datalist>
    </>
  )
}
