import fs from 'node:fs/promises';
import path from 'node:path';

const TASKS_ROOT = path.resolve('tasks');

export const saveFile = async ({
  filePath,
  content,
}: {
  filePath: string;
  content: string;
}): Promise<{ savedTo: string }> => {
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(TASKS_ROOT + path.sep) && resolved !== TASKS_ROOT) {
    throw new Error(
      `saveFile: writes are restricted to the tasks/ folder. Attempted path: ${resolved}`
    );
  }

  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, content, 'utf-8');

  return { savedTo: resolved };
};
