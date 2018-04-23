import * as ts from "typescript";

export namespace ExtractorHelpers {
    export function logWithNodePosition(node: ts.Node, message: string, cb: (fullMessage: string) => void): void {
        const sourceFile = node.getSourceFile();
        const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const linePrefix = `${sourceFile.fileName}(${position.line + 1},${position.character + 1})`;

        cb(`${linePrefix}: ${message}`);
    }
}
