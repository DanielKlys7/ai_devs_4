import dotenv from 'dotenv';

import { taggedPeopleSchema } from './schemas/taggedPeople';
import { callAI } from './tools/callAI';
import { ResponseInput } from 'openai/resources/responses/responses.mjs';

import { toolsDescriptions, tools } from './tools';

dotenv.config();

const init = async () => {
  const messages: ResponseInput = [
    {
      role: 'system',
      content:
        'Jesteś moim agentem odpowiedzialnym za rozwiązywanie zadań z kursu AI Devs. Będę Ci dostarczać zadania, a Ty będziesz je rozwiązywać, korzystając z dostępnych narzędzi. Pamiętaj, że nie musisz używać do wszystkiego AI, co się da ogarnij za pomocą kodu. Nie wrzucaj całej treści .csv do AI. Dziś zależy nam na zadaniu z tasks/01. Zawsze musisz wykonać akcję sendResponse w odpowiednim formacie - dopiero po nim możesz zakończyć. Oto lista narzędzi, które masz do dyspozycji:',
    },
  ];

  while (true) {
    const response = await callAI({
      messages,
      tools: toolsDescriptions,
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
