import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses.mjs';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.OPEN_AI_API_KEY });

export const callAI = async ({
  messages,
  format,
  temperature = 0.3,
  tools = [],
  model = 'gpt-5.4',
  max_tokens = 2000,
}: {
  messages: ResponseInput;
  format?: z.ZodObject<any>;
  tools?: any[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) => {
  const inputTokenEstimate = JSON.stringify(messages).length;
  console.log(
    `\n[AI] Calling ${model} | msgs: ${messages.length} | ~${inputTokenEstimate} chars`
  );

  const response = await openai.responses.create({
    model,
    input: messages,
    temperature,
    max_output_tokens: max_tokens,
    text: format
      ? {
          format: zodTextFormat(format, 'format'),
        }
      : {},
    tools: [{ type: 'web_search_preview' }, ...tools],
  });

  const usage = response.usage;
  console.log(
    `[AI] Response received | in: ${usage?.input_tokens ?? '?'} tokens, out: ${usage?.output_tokens ?? '?'} tokens`
  );

  return response;
};
