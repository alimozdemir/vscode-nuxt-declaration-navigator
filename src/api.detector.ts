import { TextDocument, Position, Range } from 'vscode';
import { createSourceFile, ScriptTarget, Node, isCallExpression, forEachChild, isIdentifier, CallExpression } from 'typescript';
export function apiDetector(document: TextDocument, position: Position) {
  /*const fetchRegex = /(\$fetch|useFetch)\(.*?\)/;

  document.offsetAt(position)

  const word = document.getWordRangeAtPosition(position, fetchRegex);

  console.log(document.getText(word));*/
  console.time('apiDetector');
  const sourceFile = createSourceFile(
    document.fileName,
    document.getText(),
    ScriptTarget.Latest,
    true
  );

  const offset = document.offsetAt(position);
  let foundNode: CallExpression | undefined;
  console.log(position, offset);
  console.time('findNode');
  function findNode(node: Node) {
    if (offset >= node.getStart() && offset < node.getEnd()) {
      if (isCallExpression(node) && isIdentifier(node.expression) && (node.expression.text === '$fetch' || node.expression.text === 'useFetch')) {
        foundNode = node;
        return;
      }
      console.log('invoked')
      forEachChild(node, findNode);
    }
  }

  findNode(sourceFile);

  console.timeEnd('findNode');
  if (foundNode) {
    const start = document.positionAt(foundNode.getStart());
    const end = document.positionAt(foundNode.getEnd());
    const range = new Range(start, end);
    const arg = foundNode.arguments[0];
    console.log('Found:', document.getText(range), arg.getText(sourceFile));
  }


  console.timeEnd('apiDetector');

}