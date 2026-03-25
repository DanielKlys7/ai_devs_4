import { ResponseInput } from 'openai/resources/responses/responses.mjs';

import './config/env';
import { loadPrompt } from './helpers/loadPrompt';
import { callAI } from './services/aiService';
import { toolsDescriptions, tools } from './tools';

const init = async () => {
  const prompt = await loadPrompt('agent.md');
  const task = await loadPrompt('task02.md');

  const messages: ResponseInput = [
    {
      role: 'system',
      content: prompt.text,
    },
    {
      role: 'user',
      content: task.text,
    },
  ];

  let lastCallSignature = '';
  let sameCallCount = 0;

  while (true) {
    const response = await callAI({
      messages,
      tools: toolsDescriptions,
      model: prompt.model,
      temperature: prompt.temperature,
      max_tokens: prompt.max_tokens,
    });

    messages.push(...(response.output as any[]));

    const textOutputs = response.output.filter(
      (item) => item.type === 'message'
    );
    for (const msg of textOutputs) {
      const text = (msg as any).content
        ?.filter((c: any) => c.type === 'output_text')
        .map((c: any) => c.text)
        .join('');
      if (text) console.log(`\n[AI Message]\n${text}`);
    }

    const functionCalls = response.output.filter(
      (item) => item.type === 'function_call'
    );

    if (functionCalls.length === 0 && textOutputs.length === 0) {
      console.log('[Agent] No output from AI — stopping loop.');
      return;
    }

    for (const item of functionCalls) {
      if (item.type !== 'function_call') continue;

      const args = JSON.parse(item.arguments);
      console.log(`\n[Tool] ${item.name}(${JSON.stringify(args, null, 2)})`);

      // Detect infinite loop — same tool + same args 3 times in a row
      const callSignature = `${item.name}:${item.arguments}`;
      if (callSignature === lastCallSignature) {
        sameCallCount++;
        if (sameCallCount >= 3) {
          console.log('[Agent] Loop detected — injecting correction.');
          messages.push({
            type: 'function_call_output',
            call_id: item.call_id,
            output: JSON.stringify({
              error: `LOOP DETECTED: You called ${item.name} with the same arguments ${sameCallCount} times without fixing the issue. Stop and re-read the tool description. You MUST provide a valid "body" object with the required fields.`,
            }),
          });
          sameCallCount = 0;
          lastCallSignature = '';
          continue;
        }
      } else {
        lastCallSignature = callSignature;
        sameCallCount = 1;
      }

      const tool = tools[item.name];
      const result = await tool(args);

      console.log(
        `[Result] ${JSON.stringify(result).slice(0, 300)}${JSON.stringify(result).length > 300 ? '...' : ''}`
      );

      if (item.name === 'finish') {
        console.log('\n[Agent] Finished.');
        return;
      }

      // If the tool returned an error, surface it as a clear failure message
      const output =
        result && typeof result === 'object' && 'error' in result
          ? JSON.stringify({
              error: result.error,
              hint: result.error,
              instruction: `Fix the arguments and call the tool again with the correct parameters.`,
            })
          : JSON.stringify({ result });

      messages.push({
        type: 'function_call_output',
        call_id: item.call_id,
        output,
      });
    }
  }
};

init();
