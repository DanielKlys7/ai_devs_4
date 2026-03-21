import { calculateAge } from './calculateAge';
import { filter } from './filter';
import { getFolderStructure } from './getFolderStructure';
import { parseCSV } from './parseCSV';
import { previewCSV } from './previewCSV';
import { queryCSV } from './queryCSV';
import readFile from './readFile';
import { sendResponse } from './sendResponse';

export const tools: Record<string, any> = {
  getFolderStructure,
  parseCSV,
  previewCSV,
  queryCSV,
  filter,
  calculateAge,
  sendResponse,
  readFile,
  finish: ({ answer }: { answer: string }) => answer,
};

export const toolsDescriptions = [
  {
    type: 'function',
    name: 'getFolderStructure',
    description:
      'Get the folder structure of a given path. Returns an array of file and folder names.',
    parameters: {
      type: 'object',
      properties: {
        dirPath: {
          type: 'string',
          description: 'The path to the directory to analyze.',
        },
        saveToFile: { type: 'boolean' },
      },
    },
  },
  {
    type: 'function',
    name: 'queryCSV',
    description:
      'Parse a CSV file and filter its rows in one step. Use this instead of parseCSV + filter to avoid loading the entire file into context. Provide filter conditions based on what you learned from previewCSV.',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'The path to the CSV file.',
        },
        conditions: {
          type: 'array',
          description: 'Filter conditions. All must be satisfied (AND logic).',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
                description: 'Column name to filter on.',
              },
              operator: {
                type: 'string',
                enum: ['equals', 'greaterThan', 'lessThan'],
                description: 'Comparison operator.',
              },
              value: {
                description: 'Value to compare against.',
              },
            },
            required: ['field', 'operator', 'value'],
          },
        },
      },
      required: ['filePath', 'conditions'],
    },
    returns: {
      type: 'array',
      items: { type: 'object' },
      description: 'Matching rows only — never the full dataset.',
    },
  },
  {
    type: 'function',
    name: 'calculateAge',
    description: 'Calculate the age of a person given their birth date string.',
    parameters: {
      type: 'object',
      properties: {
        birthDate: {
          type: 'string',
          description:
            'Birth date in a format parseable by the Date constructor (e.g. "1990-05-21").',
        },
      },
      required: ['birthDate'],
    },
    returns: {
      type: 'number',
      description: 'The calculated age in whole years.',
    },
  },
  {
    type: 'function',
    name: 'sendResponse',
    description:
      'Submit a task answer to the remote verification endpoint and return the server response.',
    parameters: {
      type: 'object',
      properties: {
        response: {
          description:
            'The answer payload to submit. Can be any JSON-serialisable value.',
        },
        task: {
          type: 'string',
          description:
            'The task identifier string used by the verification endpoint.',
        },
      },
      required: ['response', 'task'],
    },
    returns: {
      type: 'object',
      description:
        'The JSON response body returned by the verification server.',
    },
  },
  {
    type: 'function',
    name: 'readFile',
    description:
      'Read the contents of a file from the local filesystem and return it as a string.',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'The path to the file to read.',
        },
      },
      required: ['filePath'],
    },
    returns: {
      type: 'string',
      description: 'The full UTF-8 text content of the file.',
    },
  },
  {
    type: 'function',
    name: 'previewCSV',
    description:
      'Read a small sample of a CSV file and return its field names and a few example rows. Use this first to understand the structure of a CSV before filtering it.',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'The path to the CSV file.',
        },
        sampleSize: {
          type: 'number',
          description: 'Number of sample rows to return. Defaults to 3.',
        },
      },
      required: ['filePath'],
    },
    returns: {
      type: 'object',
      properties: {
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of column names in the CSV.',
        },
        samples: {
          type: 'array',
          items: { type: 'object' },
          description: 'A few example rows to understand the data format.',
        },
      },
    },
  },
  {
    type: 'function',
    name: 'finish',
    description:
      'Call this tool when the task is fully completed and you want to return the final answer. This ends the agent loop.',
    parameters: {
      type: 'object',
      properties: {
        answer: {
          type: 'string',
          description: 'The final answer or summary to return to the user.',
        },
      },
      required: ['answer'],
    },
    returns: {
      type: 'string',
      description: 'The final answer passed through.',
    },
  },
];
