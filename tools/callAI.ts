import dotenv from 'dotenv';

import OpenAI from 'openai';
import { ResponseInput } from 'openai/resources/responses/responses.mjs';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export const callAI = async ({
  messages,
  format,
  tools = [],
  model = 'gpt-5.4-nano',
  temperature = 0.3,
  max_tokens = 2000,
}: {
  messages: ResponseInput;
  format?: z.ZodObject<any>;
  tools?: any[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) => {
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
    tools: tools,
  });

  return response;
};
