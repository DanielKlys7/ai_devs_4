import { env } from '../config/env';

export const sendResponse = async ({
  response,
  task,
}: {
  response: any;
  task: string;
}) => {
  const res = await fetch('https://hub.ag3nts.org/verify', {
    method: 'POST',
    body: JSON.stringify({
      apikey: env.AI_DEVS_API_KEY,
      answer: response,
      task: task,
    }),
  });
  const resJson = await res.json();

  console.log('Response status:', resJson);
  return resJson;
};
