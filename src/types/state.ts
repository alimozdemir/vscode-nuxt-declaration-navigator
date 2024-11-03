import { OutputChannel } from 'vscode';
import { ConfigurationService } from '../utils/configuration';

export interface State {
    commandCall: boolean;
    log: OutputChannel;
    extensionId: string;
    extensionName: string;
    workspaceRoot?: string;
    nuxtFolder?: string;
    nitroRoutes?: string;
    config: ConfigurationService;
}