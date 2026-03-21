import { parseCSV } from './parseCSV';

export const previewCSV = async ({
  filePath,
  sampleSize = 3,
}: {
  filePath: string;
  sampleSize?: number;
}): Promise<{ fields: string[]; samples: Record<string, string>[] }> => {
  const rows = await parseCSV({ filePath });
  return {
    fields: Object.keys(rows[0] ?? {}),
    samples: rows.slice(0, sampleSize),
  };
};
