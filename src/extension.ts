import * as vscode from 'vscode';
import { State } from './state';
import { declarationProvider } from './definition.provider';
import { configuration } from './configuration';

const extensionName = 'Vue/Nuxt Declaration Navigator';
const extensionId = 'vscode-nuxt-declaration-navigator';

function getWorkspaceRoot(): string | undefined {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
			return workspaceFolders[0].uri.fsPath;
	}
	return undefined;
}

export function activate(context: vscode.ExtensionContext) {
	configuration(extensionName, context);

	const state: State = {
		commandCall: false,
		log: vscode.window.createOutputChannel(extensionName),
		extensionId: extensionId,
		extensionName
	};
	const config = vscode.workspace.getConfiguration();

	config.update('editor.gotoLocation.multipleDefinitions', 'goto');
	const workspaceRoot = getWorkspaceRoot();

	if (workspaceRoot)
		{state.workspaceRoot = workspaceRoot;}

	console.log(`${state.extensionName} is now actived (${state.extensionId})`);

	state.log.appendLine(`${state.extensionName} is now actived (${state.extensionId})`);

	const definitionProvider = vscode.languages.registerDefinitionProvider([
		{ scheme: 'file', language: 'javascript' },
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'file', language: 'javascriptreact' },
		{ scheme: 'file', language: 'typescriptreact' },
		{ scheme: 'file', language: 'vue' }
	], declarationProvider(state));

	context.subscriptions.push(state.log, definitionProvider);
	console.log(`${state.extensionName} is now ready to use!`);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log(`Your extension "${extensionId}" is now deactivated!`);
}
