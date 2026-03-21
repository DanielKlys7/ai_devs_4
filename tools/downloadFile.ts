import fs from 'fs';

import dotenv from 'dotenv';

dotenv.config();

export const downloadFile = async ({
  url,
  saveAt,
}: {
  url: string;
  saveAt: string;
}): Promise<Blob> => {
  const fileUrl = url.includes('{{api_key}}')
    ? url.replace('{{api_key}}', process.env.AI_DEVS_API_KEY || '')
    : url;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download file: ${response.status} ${response.statusText}`
      );
    }
    const blob = await response.blob();
    fs.writeFileSync(saveAt, Buffer.from(await blob.arrayBuffer()));
    console.log(`File downloaded and saved to ${saveAt}`);
    return blob;
  } catch (error: any) {
    console.error(`Error downloading file: ${error.message}`);
    throw error;
  }
};
