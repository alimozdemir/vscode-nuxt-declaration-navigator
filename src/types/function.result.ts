import { CallExpression, SourceFile } from "typescript";

export interface FunctionResult {
  name: string;
  focusedText: string;
  sourceFile: SourceFile;
  documentPath: string;
  node: CallExpression;
}