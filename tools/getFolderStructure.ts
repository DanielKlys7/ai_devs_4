import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Recursively builds a folder structure tree with proper indentation
 * @param dirPath - The directory path to scan
 * @param indent - Current indentation level (defaults to empty string for root)
 * @returns Promise that resolves to the folder structure
 */
const buildTree = async (
  dirPath: string,
  indent: string = ''
): Promise<string> => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    const visibleFiles = files.filter(
      (file) => file.name !== 'node_modules' && !file.name.startsWith('.')
    );

    const lines: string[] = [];

    for (let i = 0; i < visibleFiles.length; i++) {
      const file = visibleFiles[i];

      if (!file) continue;

      const isLast = i === visibleFiles.length - 1;
      const isDirectory = file.isDirectory();

      const prefix = isLast ? '└── ' : '├── ';
      const icon = isDirectory ? '📁' : '📄';

      lines.push(`${indent}${prefix}${icon} ${file.name}`);

      if (isDirectory) {
        const fullPath = path.join(dirPath, file.name);
        const childIndent = indent + (isLast ? '    ' : '│   ');
        const children = await buildTree(fullPath, childIndent);
        if (children) {
          lines.push(children);
        }
      }
    }

    return lines.join('\n');
  } catch (err) {
    console.error('Error reading directory:', dirPath, err);
    return '';
  }
};

export const getFolderStructure = async ({
  dirPath = path.join(import.meta.dirname, '..'),
  saveToFile = false,
}: {
  dirPath?: string;
  saveToFile?: boolean;
} = {}): Promise<string> => {
  const rootName = path.basename(dirPath);
  const tree = `📁 ${rootName}\n${await buildTree(dirPath)}`;

  if (saveToFile) {
    await fs.writeFile('folderStructure.txt', tree, 'utf-8');
  }

  return tree;
};
