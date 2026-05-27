import { streamText, Output, type ModelMessage } from 'ai'
import { getModelOptions } from '@/ai/gateway'
import { Deferred } from '@/lib/deferred'
import z from 'zod/v3'

export type File = z.infer<typeof fileSchema>

const fileSchema = z.object({
  path: z
    .string()
    .describe(
      "Path to the file in the Vercel Sandbox (relative paths from sandbox root, e.g., 'src/main.js', 'package.json', 'components/Button.tsx')"
    ),
  content: z
    .string()
    .describe(
      'The content of the file as a utf8 string (complete file contents that will replace any existing file at this path)'
    ),
})

interface Params {
  messages: ModelMessage[]
  modelId: string
  paths: string[]
}

interface FileContentChunk {
  files: z.infer<typeof fileSchema>[]
  paths: string[]
  written: string[]
}

export async function* getContents(
  params: Params
): AsyncGenerator<FileContentChunk> {
  const generated: z.infer<typeof fileSchema>[] = []
  const deferred = new Deferred<void>()
  const result = streamText({
    ...getModelOptions(params.modelId, { reasoningEffort: 'low' }),
    maxOutputTokens: 64000,
    system:
      'You are a file content generator for Expo React Native iOS apps. Generate files based on the conversation history and the provided paths. Follow these rules strictly:\n\n' +
      '1. NEVER generate lock files (package-lock.json, yarn.lock, pnpm-lock.yaml)\n' +
      '2. NEVER generate .next/, node_modules/, or build artifacts\n' +
      '3. ALL files must be TypeScript (.ts or .tsx) — no .js files in src/ or app/\n' +
      '4. Use strict TypeScript — no `any` types\n' +
      '5. Use React Native StyleSheet.create for styling — no Tailwind or web CSS\n' +
      '6. iOS ONLY — no Android-specific code or Platform.OS === "android" checks\n' +
      '7. Use Expo Router for navigation (file-based routing in app/)\n' +
      '8. Use RTK Query with queryFn+Supabase pattern for all data fetching\n' +
      '9. Use @/* path alias (maps to ./src/*) for imports from src/\n' +
      '10. Use SafeAreaView from react-native-safe-area-context for screens\n' +
      '11. package.json MUST have "main": "expo-router/entry"\n' +
      '12. tsconfig.json MUST extend "expo/tsconfig.base" with strict:true and @/* path alias\n',
    messages: [
      ...params.messages,
      {
        role: 'user',
        content: `Generate the content of the following files according to the conversation: ${params.paths.map(
          (path) => `\n - ${path}`
        )}`,
      },
    ],
    output: Output.object({ schema: z.object({ files: z.array(fileSchema) }) }),
    onError: (error) => {
      deferred.reject(error)
      console.error('Error communicating with AI')
      console.error(JSON.stringify(error, null, 2))
    },
  })

  for await (const items of result.partialOutputStream) {
    if (!Array.isArray(items?.files)) {
      continue
    }

    const written = generated.map((file) => file.path)
    const paths = written.concat(
      items.files
        .slice(generated.length, items.files.length - 1)
        .flatMap((f) => (f?.path ? [f.path] : []))
    )

    const files = items.files
      .slice(generated.length, items.files.length - 2)
      .map((file) => fileSchema.parse(file))

    if (files.length > 0) {
      yield { files, paths, written }
      generated.push(...files)
    } else {
      yield { files: [], written, paths }
    }
  }

  const raceResult = await Promise.race([result.output, deferred.promise])
  if (!raceResult) {
    throw new Error('Unexpected Error: Deferred was resolved before the result')
  }

  const written = generated.map((file) => file.path)
  const files = raceResult.files.slice(generated.length)
  const paths = written.concat(files.map((file) => file.path))
  if (files.length > 0) {
    yield { files, written, paths }
    generated.push(...files)
  }
}
