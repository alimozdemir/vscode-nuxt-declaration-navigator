import * as vscode from 'vscode';

const multipleDefinitions = 'editor.gotoLocation.multipleDefinitions';
const confirmSetting = 'editor.gotoLocation.confirmPeek';

export async function configuration(name: string, e: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration();

  if (e.globalState.get(confirmSetting))
    return;

  if (config.get(multipleDefinitions) === 'goto') {
    return;
  }

  const response = await vscode.window.showInformationMessage(
    `
    [${name}]
    We recommend you to set ${multipleDefinitions} to 'goto' for better experience
    Click OK to set it now.
    `,
    'OK',
    'Not now'
  )

  if (response === 'OK') {
    await config.update(multipleDefinitions, 'goto');
  }

  e.globalState.update(confirmSetting, true);
}