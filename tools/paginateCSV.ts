import { parse } from 'csv-parse/sync';
import fs from 'node:fs/promises';

export const paginateCSV = async ({
  filePath,
  offset = 0,
  limit = 100,
}: {
  filePath: string;
  offset?: number;
  limit?: number;
}): Promise<{
  rows: Record<string, string>[];
  total: number;
  hasMore: boolean;
}> => {
  const fileContent = await fs.readFile(filePath, 'utf-8');

  const all: Record<string, string>[] = parse(fileContent, {
    delimiter: ',',
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const rows = all.slice(offset, offset + limit);

  return {
    rows,
    total: all.length,
    hasMore: offset + limit < all.length,
  };
};
