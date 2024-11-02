import { TextDocument, Position } from 'vscode';
import { createSourceFile, ScriptTarget, Node, isCallExpression, 
  forEachChild, isIdentifier, CallExpression } from 'typescript';

const functionNames = ['$fetch', 'useFetch', '$fetchSetup'];

export function apiDetector(document: TextDocument, position: Position) {
  const lookingFor = document.getText(document.getWordRangeAtPosition(position));
  const sourceFile = createSourceFile(
    document.fileName,
    document.getText(),
    ScriptTarget.Latest,
    true
  );

  const offset = document.offsetAt(position);
  let foundNode: CallExpression | undefined;
  function findNode(node: Node) {
    if (offset >= node.getStart() && offset < node.getEnd()) {


      if (isCallExpression(node) && isIdentifier(node.expression) && 
        (functionNames.includes(node.expression.text))) {
        foundNode = node;
        return;
      }
      forEachChild(node, findNode);
    }
  }

  findNode(sourceFile);

  if (foundNode && foundNode.arguments.length > 0) {
    const arg = foundNode.arguments[0];
    const argText = arg.getText(sourceFile);
    if (argText.includes(lookingFor)) {
      return argText;
    }
  }
}