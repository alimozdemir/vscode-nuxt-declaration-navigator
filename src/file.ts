
import { stat, readdir } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { TextDocument } from 'vscode';

export async function getNuxtFolder(workspace: string): Promise<string | undefined> {
	// traverse all folders in the workspace and find the .nuxt folder
	// if it exists, return the path to it
	// otherwise, return undefined
  async function traverseFolders(path: string) : Promise<string | undefined> {
    const items = await readdir(path);

    for (const item of items) {
      const itemPath = join(path, item);
      const s = await stat(itemPath);
      if (s.isDirectory()) {
        if (item.endsWith('.nuxt')) {
          return itemPath;
        }

        const result = await traverseFolders(itemPath);
        if (result) {
          return result;
        }
      }
    }
  }

  const folder = await traverseFolders(workspace);

	return folder;
}

export async function fileExists(filePath: string) {
  try {
      const result = await stat(filePath);
      return result.isFile();
  } catch (error) {
      return false;
  }
}    

export function correlatePath(document: TextDocument, importPath: string, workspaceRoot?: string) {
  const documentFolder = dirname(document.uri.fsPath);
  const absoluteImportPath = resolve(workspaceRoot ?? '',
      documentFolder, importPath);

  return absoluteImportPath;
}

export async function findFile(filePath: string, possibleExtensions: string[]): Promise<string | undefined> {
  if (await fileExists(filePath)) {
      return filePath;
  }

  for (const ext of possibleExtensions) {
      const possiblePath = filePath + ext;
      if (await fileExists(possiblePath)) {
          return possiblePath;
      }
  }

  return undefined;
}

export function joinPath(...paths: string[]) {
  return join(...paths);
}