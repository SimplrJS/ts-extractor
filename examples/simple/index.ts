import * as ts from "typescript";

export enum ApiItemKindsAdditional {
    ___Any = "any",
    ___Any2 = "any2"
}

export type SupportedApiItemKindType = ts.SyntaxKind | ApiItemKindsAdditional;
