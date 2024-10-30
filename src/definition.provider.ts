import * as vscode from 'vscode';
import { defaultProvider } from './vscode.helper';
import { State } from './state';
import * as path from 'path';


export function declarationProvider(state: State): vscode.DefinitionProvider {
    return {
        async provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
            if (state.commandCall) return;

            const range = document.getWordRangeAtPosition(position);
            const objectName = document.getText(range);

            state.log.appendLine("Looking for definition: " + objectName);

            const result: vscode.Location[] = [];

            const defaultDef = await defaultProvider(state, document, position);

            try {
                if (defaultDef) {
                    for (const def of defaultDef) {
                        if (def.targetUri.path.endsWith('.d.ts')) {
                            const document = await vscode.workspace.openTextDocument(def.targetUri);
                            const text = document.getText(def.targetRange);

                            const regex = /import\(["'](.+?)["']\)/;
                            const match = text.match(regex);
                            const importPath = match ? match[1] : null;

                            state.log.appendLine("Import path:" + importPath);
                            if (importPath) {
                                const documentFolder = path.dirname(document.uri.fsPath);
                                const absoluteImportPath = path.resolve(documentFolder, importPath);

                                result.push({
                                    range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)),
                                    uri: vscode.Uri.parse(absoluteImportPath),
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                state.log.appendLine('error: ' + error);
            }

            return result;
        }
    };
}

