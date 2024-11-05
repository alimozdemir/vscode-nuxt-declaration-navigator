import { Node, ExportAssignment, SyntaxKind, isExportAssignment, CallExpression, isCallExpression, forEachChild, isIdentifier, isObjectLiteralExpression, Expression, ObjectLiteralExpression, ObjectLiteralElementLike } from "typescript";

export function findFunction(node: Node, functionNames: string[]): CallExpression | undefined {

  let foundNode: CallExpression | undefined;

  const findNode = (node: Node) => {
    if (isCallExpression(node) && isIdentifier(node.expression) && 
      (functionNames.includes(node.expression.text))) {
      foundNode = node;
      return;
    }
    forEachChild(node, findNode);
  };

  findNode(node);

  return foundNode;
}

export function findProperty(e: Expression, param: string) : ObjectLiteralElementLike | undefined {
  if (!isObjectLiteralExpression(e)) {
    return;
  }
   
  const object: ObjectLiteralExpression = e;

  const propMethod = object.properties
      .find(i => i.name?.getText() === param);

  return propMethod;
}