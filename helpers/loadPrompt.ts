import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

export async function loadPrompt(filename: string) {
  const filePath = path.resolve('prompts', filename);
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data: meta, content: promptText } = matter(raw);

  return {
    name: meta.name as string,
    version: (meta.version ?? '1.0') as string,
    tags: (meta.tags ?? []) as string[],
    model: (meta.model ?? 'gpt-4o-mini') as string,
    temperature: (meta.temperature ?? 0.3) as number,
    max_tokens: (meta.max_tokens ?? 2000) as number,
    timeout_ms: (meta.timeout_ms ?? 60000) as number,
    output_format: (meta.output_format ?? 'text') as 'json' | 'text',
    text: promptText.trim(),
  };
}
