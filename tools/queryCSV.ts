import { filter } from './filter';
import { parseCSV } from './parseCSV';

export const queryCSV = async ({
  filePath,
  conditions,
}: {
  filePath: string;
  conditions: {
    field: string;
    operator: 'equals' | 'greaterThan' | 'lessThan';
    value: any;
  }[];
}): Promise<Record<string, string>[]> => {
  const rows = await parseCSV({ filePath });
  return filter({ data: rows, conditions });
};
