import { parse } from 'csv-parse/sync';
import fs from 'node:fs/promises';

/**
 * Reads and parses a CSV file from the given path
 * @param filePath - Path to the CSV file
 * @returns Array of objects where each object represents a row
 */

export const parseCSV = async ({ filePath }: { filePath: string }) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const records = parse(fileContent, {
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};
