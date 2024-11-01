import * as vscode from 'vscode';
import { defaultProvider } from './vscode.helper';
import { State } from './state';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as ts from 'typescript';

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
                if (defaultDef && defaultDef.length > 0) {
                    for (const def of defaultDef) {
                        if (def.targetUri.path.endsWith('.d.ts')) {
                            const dTsResult = await dTs(def);
                            result.push(...dTsResult);
                        }
                    }
                }
            } catch (error) {
                console.error(error)
                state.log.appendLine('error: ' + error);
            }
            
            return result;
        }
    };

    async function dTs(def: vscode.LocationLink) {
        const document = await vscode.workspace.openTextDocument(def.targetUri);
        const text = document.getText(def.targetRange);

        const regex = /import\(["'](.+?)["']\)\['(.*?)'\]/;
        const match = text.match(regex);
        const importPath = match ? match[1] : undefined;
        const bracketText = match ? match[2] : undefined;

        let result: vscode.Location[];

        if (importPath) {
            result = await inlineImport(importPath, document, bracketText);
        } else {
            result = await topImport(text, document);
        }

        return result;
    }

    async function inlineImport(importPath: string, document: vscode.TextDocument, pointer?: string) {
        state.log.appendLine("Import path:" + importPath);

        const result: vscode.Location[] = [];

        if (importPath) {
            const absoluteImportPath = correlatePath(document, importPath);
            const foundFile = await findFile(absoluteImportPath);

            state.log.appendLine("Absolute path:" + foundFile);

            if (foundFile) {
                let position = new vscode.Position(0, 0);

                if (pointer)
                    position = await findPosition(pointer, foundFile) ?? new vscode.Position(0, 0);
                
                result.push({
                    range: new vscode.Range(position, position),
                    uri: vscode.Uri.parse(foundFile),
                });
            }
        }

        return result;
    }

    async function topImport(text: string, document: vscode.TextDocument) {
        const result: vscode.Location[] = [];

        if (!text.includes(':')) {
            return result;
        }

        const pair = text.split(':');

        if (!pair || pair.length !== 2) {
            return result;
        }

        let typeDef = pair[1].trim();

        if (typeDef.endsWith(','))
            typeDef = typeDef.slice(0, -1);

        // TODO: ts.ScriptTarget.Latest might lead to issues
        const sf = ts.createSourceFile('dummy', document.getText(), ts.ScriptTarget.Latest);

        const importDeclarations = sf.statements.filter(ts.isImportDeclaration);
        const importDec = importDeclarations.find(i => i.getText(sf).includes(typeDef));

        if (!importDec) {
            return result;
        }

        const importPath = importDec.moduleSpecifier.getText(sf).slice(1, -1);
        const absoluteImportPath = correlatePath(document, importPath);

        const foundFile = await findFile(absoluteImportPath);

        state.log.appendLine("Absolute path:" + foundFile);

        if (foundFile) {
            result.push({
                range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)),
                uri: vscode.Uri.parse(foundFile),
            });
        }

        return result;
    }

    async function findFile(filePath: string): Promise<string | undefined> {
        if (await fileExists(filePath)) {
            return filePath;
        }

        const possibleExtensions = ['.d.ts', '.vue', '.ts', '.tsx', '.js', '.jsx'];

        for (const ext of possibleExtensions) {
            const possiblePath = filePath + ext;

            if (await fileExists(possiblePath)) {
                return possiblePath;
            }
        }

        return undefined;
    }

    function correlatePath(document: vscode.TextDocument, importPath: string) {
        const documentFolder = path.dirname(document.uri.fsPath);
        const absoluteImportPath = path.resolve(state.workspaceRoot ?? '',
            documentFolder, importPath);

        return absoluteImportPath;
    }

    async function fileExists(filePath: string) {
        try {
            const result = await fs.stat(filePath);
            return result.isFile();
        } catch (error) {
            return false;
        }
    }

    async function findPosition(objectName: string, filePath: string): Promise<vscode.Position | undefined> {
        const document = await vscode.workspace.openTextDocument(filePath);
        // TODO: ts.ScriptTarget.Latest might lead to issues
        const sf = ts.createSourceFile('dummy', document.getText(), ts.ScriptTarget.Latest);

        let foundPosition: vscode.Position | undefined;

        const visitor: ts.Visitor = node => {

            if (ts.isVariableDeclaration(node)) {
                if (node.name.getText(sf) === objectName) {
                    const start = node.getStart(sf);
                    const position = document.positionAt(start);
                    foundPosition = position;
                    return;
                }
            }

            return ts.visitEachChild(node, visitor, undefined);
        };

        ts.visitNode(sf, visitor);

        return foundPosition;
    }
}

