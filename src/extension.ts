import * as vscode from 'vscode';
import { State } from './state';
import { declarationProvider } from './definition.provider';

const extensionName = 'Declaration Navigator';


function getWorkspaceRoot(): string | undefined {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
			return workspaceFolders[0].uri.fsPath;
	}
	return undefined;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const state: State = {
		commandCall: false,
		log: vscode.window.createOutputChannel(extensionName),
		extensionId: 'vscode-declaration-navigator',
		extensionName
	}
	
	const workspaceRoot = getWorkspaceRoot();

	if (workspaceRoot)
		state.workspaceRoot = workspaceRoot;

	console.log(`${state.extensionName} is now actived (${state.extensionId})`);
	state.log.appendLine(`${state.extensionName} is now actived (${state.extensionId})`);

	const disposable = vscode.commands.registerCommand('vscode-declaration-navigator.helloWorld', () => {
		vscode.window.showInformationMessage('!2Hello World from vscode-declaration-navigator!!!!');
	});

	const definitionProvider = vscode.languages.registerDefinitionProvider([
		{ scheme: 'file', language: 'javascript' },
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'file', language: 'javascriptreact' },
		{ scheme: 'file', language: 'typescriptreact' },
		{ scheme: 'file', language: 'vue' }
	], declarationProvider(state))

	context.subscriptions.push(state.log, disposable, definitionProvider);
	console.log(`${state.extensionName} is now ready to use!`);
	state.log.show();
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Your extension "vscode-declaration-navigator" is now deactivated!');
}
