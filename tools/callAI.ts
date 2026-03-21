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
}: {
  messages: ResponseInput;
  format?: z.ZodObject<any>;
  tools?: any[];
}) => {
  const response = await openai.responses.create({
    model: 'gpt-5.4-mini',
    input: messages,
    text: format
      ? {
          format: zodTextFormat(format, 'format'),
        }
      : {},
    tools: tools,
  });

  return response;
};
