import { env } from '../config/env';

const BASE_URL = 'https://hub.ag3nts.org';

const resolveUrl = (endpoint: string) => {
  const raw = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  return raw.includes('{{api_key}}')
    ? raw.replace('{{api_key}}', env.AI_DEVS_API_KEY)
    : raw;
};

export const callApiGet = async ({
  endpoint,
}: {
  endpoint: string;
}): Promise<any> => {
  const url = resolveUrl(endpoint);
  console.log(`callApiGet: ${url}`);
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const details = await res.text().catch(() => res.statusText);
    return { error: `${res.status} ${res.statusText}`, details };
  }
  return res.json();
};

export const callApiPost = async ({
  endpoint,
  body,
}: {
  endpoint: string;
  body: Record<string, any>;
}): Promise<any> => {
  if (!body || Object.keys(body).length === 0) {
    return {
      error:
        'body is required for POST requests. Provide the required fields (e.g. { name, surname } for /api/location).',
    };
  }
  const url = resolveUrl(endpoint);
  console.log(`callApiPost: ${url}, body: ${JSON.stringify(body)}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apikey: env.AI_DEVS_API_KEY, ...body }),
  });
  if (!res.ok) {
    const details = await res.text().catch(() => res.statusText);
    return { error: `${res.status} ${res.statusText}`, details };
  }
  return res.json();
};
