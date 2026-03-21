import dotenv from 'dotenv';
import { ResponseInput } from 'openai/resources/responses/responses.mjs';

import { loadPrompt } from './helpers/loadPrompt';
import { callAI } from './tools/callAI';
import { toolsDescriptions, tools } from './tools';

dotenv.config();

const init = async () => {
  const prompt = await loadPrompt('agent.md');

  const messages: ResponseInput = [
    {
      role: 'system',
      content: prompt.text,
    },
    { role: 'user', content: 'Start with tasks/01' },
  ];

  while (true) {
    const response = await callAI({
      messages,
      tools: toolsDescriptions,
      model: prompt.model,
      temperature: prompt.temperature,
      max_tokens: prompt.max_tokens,
    });

    messages.push(...(response.output as any[]));

    const functionCalls = response.output.filter(
      (item) => item.type === 'function_call'
    );

    for (const item of functionCalls) {
      if (item.type !== 'function_call') continue;
      const tool = tools[item.name];
      const result = await tool(JSON.parse(item.arguments));

      if (item.name === 'finish') {
        console.log('AI Response:', result);
        return;
      }

      messages.push({
        type: 'function_call_output',
        call_id: item.call_id,
        output: JSON.stringify({ result }),
      });
    }
  }
};

init();
