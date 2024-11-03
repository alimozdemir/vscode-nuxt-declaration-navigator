import { OutputChannel } from 'vscode';

export interface State {
    commandCall: boolean;
    log: OutputChannel;
    extensionId: string;
    extensionName: string;
    workspaceRoot?: string;
    nuxtFolder?: string;
    nitroRoutes?: string;
}