import fs from 'node:fs/promises';

const readFile = async ({
  filePath,
}: {
  filePath: string;
}): Promise<string> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error: any) {
    return `ERROR: ${error.code === 'ENOENT' ? `File not found: ${filePath}` : error.message}`;
  }
};

export default readFile;
