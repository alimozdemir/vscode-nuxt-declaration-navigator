import { ExtensionContext, window, workspace } from 'vscode';

const multipleDefinitions = 'editor.gotoLocation.multipleDefinitions';
const confirmSetting = 'editor.gotoLocation.confirmPeek';

export async function configuration(name: string, e: ExtensionContext) {
  const config = workspace.getConfiguration();

  const settings = workspace.getConfiguration(name);

  console.log(config.get('nuxtDeclarationNavigator.api.hover.enable'));
  console.log(config.get('nuxtDeclarationNavigator.api.functions'));

  if (e.globalState.get(confirmSetting))
    {return;}

  if (config.get(multipleDefinitions) === 'goto') {
    return;
  }

  const response = await window.showInformationMessage(
    `
    [${name}]
    We recommend you to set ${multipleDefinitions} to 'goto' for better experience
    Click OK to set it now.
    `,
    'OK',
    'Not now'
  );

  if (response === 'OK') {
    await config.update(multipleDefinitions, 'goto');
  }

  e.globalState.update(confirmSetting, true);
}