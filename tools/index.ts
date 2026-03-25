import { calculateAge } from './calculateAge';
import { calculateDistance } from './calculateDistance';
import { callApiGet, callApiPost } from './callApi';
import { downloadFile } from './downloadFile';
import { filter } from './filter';
import { getFolderStructure } from './getFolderStructure';
import { getCoordinates } from './getCoordinates';
import { getNearestPowerplant } from './getNearestPowerplant';
import { paginateCSV } from './paginateCSV';
import { parseCSV } from './parseCSV';
import { previewCSV } from './previewCSV';
import { queryCSV } from './queryCSV';
import readFile from './readFile';
import { saveFile } from './saveFile';
import { sendResponse } from './sendResponse';

export const tools: Record<string, any> = {
  getFolderStructure,
  parseCSV,
  previewCSV,
  paginateCSV,
  queryCSV,
  filter,
  calculateAge,
  calculateDistance,
  callApiGet,
  callApiPost,
  getCoordinates,
  getNearestPowerplant,
  downloadFile,
  saveFile,
  sendResponse,
  readFile,
  finish: ({ answer }: { answer: string }) => answer,
};

export const toolsDescriptions = [
  {
    type: 'function',
    name: 'calculateDistance',
    description:
      "Calculate the great-circle distance in kilometres between two GPS coordinates using the Haversine formula. Use this to compare a person's sighting location with a power plant location.",
    parameters: {
      type: 'object',
      properties: {
        lat1: { type: 'number', description: 'Latitude of point 1.' },
        lon1: { type: 'number', description: 'Longitude of point 1.' },
        lat2: { type: 'number', description: 'Latitude of point 2.' },
        lon2: { type: 'number', description: 'Longitude of point 2.' },
      },
      required: ['lat1', 'lon1', 'lat2', 'lon2'],
    },
    returns: {
      type: 'number',
      description: 'Distance in kilometres.',
    },
  },
  {
    type: 'function',
    name: 'getNearestPowerplant',
    description:
      'Given a list of sighting coordinates for one person and a list of power plants (city + code), resolves each city to GPS coords via Nominatim and returns the power plant closest to any sighting, along with the distance in km. Use this once per person after calling /api/location.',
    parameters: {
      type: 'object',
      properties: {
        sightings: {
          type: 'array',
          description:
            'List of GPS coordinates where the person was sighted (from /api/location response).',
          items: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
            required: ['latitude', 'longitude'],
          },
        },
        powerPlants: {
          type: 'array',
          description:
            'List of power plants to check, each with city name and code from findhim_locations.json.',
          items: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: 'Polish city name, e.g. "Zabrze".',
              },
              code: {
                type: 'string',
                description: 'Power plant code, e.g. "PWR3847PL".',
              },
            },
            required: ['city', 'code'],
          },
        },
      },
      required: ['sightings', 'powerPlants'],
    },
    returns: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        code: {
          type: 'string',
          description: 'Power plant code to use in the final answer.',
        },
        distanceKm: {
          type: 'number',
          description: 'Distance in km to the nearest sighting.',
        },
        nearestSighting: {
          type: 'object',
          description: 'The sighting coordinates closest to this plant.',
        },
      },
    },
  },
  {
    type: 'function',
    name: 'callApiGet',
    description:
      'Make an HTTP GET request to an external endpoint. Supports {{api_key}} placeholder in the URL (replaced with AI_DEVS_API_KEY automatically). Never use this to submit task answers — use sendResponse for that.',
    parameters: {
      type: 'object',
      properties: {
        endpoint: {
          type: 'string',
          description:
            'Endpoint path (e.g. /api/data) or full URL. Relative paths are resolved against https://hub.ag3nts.org. Use {{api_key}} placeholder if the key must appear in the URL.',
        },
      },
      required: ['endpoint'],
    },
    returns: {
      type: 'object',
      description: 'Parsed JSON response from the API.',
    },
  },
  {
    type: 'function',
    name: 'callApiPost',
    description:
      'Make an HTTP POST request to an external endpoint. apikey is injected into the body automatically — do not include it. Never use this to submit task answers — use sendResponse for that.',
    parameters: {
      type: 'object',
      properties: {
        endpoint: {
          type: 'string',
          description:
            'Endpoint path (e.g. /api/location) or full URL. Relative paths are resolved against https://hub.ag3nts.org.',
        },
        body: {
          type: 'object',
          description:
            'JSON fields to include in the POST body. apikey is added automatically - **do not include it**. Examples: { name, surname } for /api/location; { name, surname, birthYear } for /api/accesslevel.',
        },
      },
      required: ['endpoint', 'body'],
    },
    returns: {
      type: 'object',
      description: 'Parsed JSON response from the API.',
    },
  },
  {
    type: 'function',
    name: 'getFolderStructure',
    description:
      'Recursively scan a directory and return its structure as an indented tree string. Defaults to the project root if no path is given. Skips node_modules and hidden files.',
    parameters: {
      type: 'object',
      properties: {
        dirPath: {
          type: 'string',
          description:
            'Path to the directory to scan. Defaults to the project root.',
        },
        saveToFile: {
          type: 'boolean',
          description:
            'If true, also saves the tree to folderStructure.txt in the project root.',
        },
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
    description:
      'Calculate the age of a person based on their birth year. Uses current year (2026) minus birth year.',
    parameters: {
      type: 'object',
      properties: {
        birthDate: {
          type: 'string',
          description:
            'Birth date parseable by the Date constructor (e.g. "1990-05-21"). Only the year part is used.',
        },
      },
      required: ['birthDate'],
    },
    returns: {
      type: 'number',
      description: 'Age in years (2026 minus birth year).',
    },
  },
  {
    type: 'function',
    name: 'sendResponse',
    description:
      'Submit a task answer to the AI Devs verification endpoint. apikey is injected automatically — do not include it. Always use this (never callApi) to send task answers.',
    parameters: {
      type: 'object',
      properties: {
        response: {
          description:
            'The answer payload. Can be any JSON-serialisable value (string, number, object, array).',
        },
        task: {
          type: 'string',
          description:
            'Task identifier (e.g. "findhim", "survivors"). Found in the task description.',
        },
      },
      required: ['response', 'task'],
    },
    returns: {
      type: 'object',
      description:
        'JSON response from the verification server. Check for success/error status here.',
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
    name: 'downloadFile',
    description:
      'Download a file from a URL and save it to a local path. Supports {{api_key}} placeholder in the URL (replaced with AI_DEVS_API_KEY automatically). Use this to fetch task data files before processing them locally.',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description:
            'The URL to download from. Use {{api_key}} as a placeholder if the key should be injected.',
        },
        saveAt: {
          type: 'string',
          description:
            'Local file path where the downloaded file will be saved.',
        },
      },
      required: ['url', 'saveAt'],
    },
    returns: {
      type: 'object',
      description: 'The downloaded file as a Blob.',
    },
  },
  {
    type: 'function',
    name: 'saveFile',
    description:
      'Write text content to a file. Can only write inside the tasks/ folder — any other path will throw an error.',
    parameters: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Path to the file to write (must be inside tasks/).',
        },
        content: {
          type: 'string',
          description: 'Text content to write to the file.',
        },
      },
      required: ['filePath', 'content'],
    },
    returns: {
      type: 'object',
      properties: {
        savedTo: {
          type: 'string',
          description: 'Absolute path where the file was saved.',
        },
      },
    },
  },
  {
    type: 'function',
    name: 'finish',
    description:
      'End the agent loop. Call this after sendResponse has returned a successful verification response. Pass a short summary of what was done and what answer was submitted.',
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
