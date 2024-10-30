import * as vscode from 'vscode';
import { State } from './state';

export async function defaultProvider(state: State, document: vscode.TextDocument, position: vscode.Position) {
    state.commandCall = true;
    const definitions = await vscode.commands.executeCommand<vscode.LocationLink[]>(
        'vscode.executeDefinitionProvider',
        document.uri,
        position
    );
    state.commandCall = false;
    return definitions;
  }