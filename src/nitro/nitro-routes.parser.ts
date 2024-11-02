import { createSourceFile, ImportTypeNode, isFunctionDeclaration, isImportDeclaration, isImportTypeNode, isPropertySignature, isStringLiteral, isVariableDeclaration, 
  Node, ScriptTarget, SyntaxKind, visitEachChild, visitNode, Visitor } from "typescript";
import { Position, workspace } from "vscode";
import { correlatePath } from "../file";

export async function nitroRoutesParser(path: string, api: string): Promise<string | undefined> {
    const document = await workspace.openTextDocument(path);  

    // TODO: ts.ScriptTarget.Latest might lead to issues
    const sourceFile = createSourceFile(
        document.fileName,
        document.getText(),
        ScriptTarget.Latest,
        true
    );

    let foundNode: Node | undefined;

    const apiDefinitionVisitor: Visitor = node => {
      if (isPropertySignature(node)) {
          const assign = node.getChildAt(0);
          if (assign && isStringLiteral(assign) && assign.getText(sourceFile) === api) {
            foundNode = node;
            return;
          }
        }
        return visitEachChild(node, apiDefinitionVisitor, undefined);
    };

    visitNode(sourceFile, apiDefinitionVisitor);
    
    if (!foundNode) return;

    let foundImport: ImportTypeNode | undefined;

    const importVisitor: Visitor = node => {
        if (isImportTypeNode(node)) {
          foundImport = node;
          return;
        }
        return visitEachChild(node, importVisitor, undefined);
    }

    visitNode(foundNode, importVisitor);

    if (foundImport) {
      const path = foundImport.argument.getText(sourceFile)
      .replaceAll("'", "")
      .replaceAll('"', "");

      const fullPath = correlatePath(document, path);
      
      return fullPath
    }

}