import * as vscode from 'vscode';

export interface State {
    commandCall: boolean;
    log: vscode.OutputChannel;
    extensionId: string;
    extensionName: string;
    workspaceRoot?: string;
    nuxtFolder?: string;
    nitroRoutes?: string;
}