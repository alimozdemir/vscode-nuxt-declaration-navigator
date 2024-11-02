import { State } from './state';
import { configuration } from './configuration';
import { getNuxtFolder, joinPath } from './file';
import { ApiHoverProvider } from './hover/api.hover';
import { MainProvider } from './definition/main';
import { workspace, ExtensionContext, window, languages } from 'vscode';

const extensionName = 'Vue/Nuxt Declaration Navigator';
const extensionId = 'vscode-nuxt-declaration-navigator';
const nitroRoutes = 'types/nitro-routes.d.ts';

function getWorkspaceRoot(): string | undefined {
	const workspaceFolders = workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		return workspaceFolders[0].uri.fsPath;
	}
	return undefined;
}

export function activate(context: ExtensionContext) {
	configuration(extensionName, context);

	const state: State = {
		commandCall: false,
		log: window.createOutputChannel(extensionName),
		extensionId: extensionId,
		extensionName
	};
	const config = workspace.getConfiguration();

	config.update('editor.gotoLocation.multipleDefinitions', 'goto');
	const workspaceRoot = getWorkspaceRoot();

	if (workspaceRoot) {
		state.workspaceRoot = workspaceRoot;

		getNuxtFolder(state.workspaceRoot).then((folder) => {
			state.nuxtFolder = folder;
			state.nitroRoutes = folder ? joinPath(folder, nitroRoutes) : undefined;
		});
	}

	console.log(`${state.extensionName} is now actived (${state.extensionId})`);

	state.log.appendLine(`${state.extensionName} is now actived (${state.extensionId})`);

	const definitionProvider = languages.registerDefinitionProvider([
		{ scheme: 'file', language: 'javascript' },
		{ scheme: 'file', language: 'typescript' },
		{ scheme: 'file', language: 'javascriptreact' },
		{ scheme: 'file', language: 'typescriptreact' },
		{ scheme: 'file', language: 'vue' }
	], new MainProvider(state));

	const hover = languages.registerHoverProvider([
		{ scheme: 'file', language: 'vue' }
	], new ApiHoverProvider(state))

	context.subscriptions.push(state.log, hover, definitionProvider);
	console.log(`${state.extensionName} is now ready to use!`);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log(`Your extension "${extensionId}" is now deactivated!`);
}
