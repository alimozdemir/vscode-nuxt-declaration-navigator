import * as vscode from 'vscode';
import { State } from './state';
import { declarationProvider } from './definition.provider';

const extensionName = 'Declaration Navigator';

const state: State = {
	commandCall: false,
	log: vscode.window.createOutputChannel(extensionName),
	extensionId: 'vscode-declaration-navigator',
	extensionName
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	state.log.appendLine(`${state.extensionName} is now actived (${state.extensionId})`);

	context.subscriptions.push(state.log);

	const disposable = vscode.commands.registerCommand('vscode-declaration-navigator.helloWorld', () => {
		vscode.window.showInformationMessage('!2Hello World from vscode-declaration-navigator!!!!');
	});

	const definitionProvider = vscode.languages.registerDefinitionProvider([
		'javascript',
		'typescript',
		'javascriptreact',
		'typescriptreact',
		'vue',
	], declarationProvider(state))

	context.subscriptions.push(disposable, definitionProvider);

}

// This method is called when your extension is deactivated
export function deactivate() { }
