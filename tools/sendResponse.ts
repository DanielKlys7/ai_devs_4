import dotenv from 'dotenv';

dotenv.config();

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
      apikey: process.env.AI_DEVS_API_KEY,
      answer: response,
      task: task,
    }),
  });
  const resJson = await res.json();

  console.log('Response status:', resJson);
  return resJson;
};
