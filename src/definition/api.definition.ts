import { TextDocument, Position, CancellationToken, Range, Uri, Location } from "vscode";
import { State } from "../state";
import { apiDetector } from "../api.detector";
import { nitroRoutesParser } from "../nitro/nitro-routes.parser";
import { correlatePath, findFile } from "../file";

export class ApiDefinitionProvider {

  constructor(private state: State) {
  }

  async run(document: TextDocument, position: Position, token: CancellationToken): Promise<Location[] | undefined> {
    if (!this.state.nitroRoutes)
      return;

    const isApi = apiDetector(document, position);
    
    if (isApi) {
      const result = await nitroRoutesParser(this.state.nitroRoutes, isApi);
      if (result) {

        const fullPath = correlatePath(document, result, this.state.workspaceRoot);
        const file = await findFile(fullPath, ['.ts', '.js']);

        this.state.log.appendLine(`Hovering over ${isApi} at ${fullPath}`);
        
        if (!file) {
          return;
        }

        this.state.log.appendLine("Absolute path:" + file);

        return [{
            range: new Range(new Position(0, 0), new Position(0, 0)),
            uri: Uri.parse(file),
        }]
      }
    }

    return;
  }

}