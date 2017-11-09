import * as ts from "typescript";
import { Dictionary } from "./dictionary";

export interface ReadonlyRegistry<TItem> {
    // Extraction
    readonly autoExtract: boolean;
    Extract(): void;

    // Existance checks
    HasSymbol(symbol: ts.Symbol | undefined): boolean;
    HasDeclaration(symbol: ts.Symbol | undefined, declaration: ts.Declaration | undefined): boolean;

    GetDeclarationId(symbol: ts.Symbol | undefined, declaration: ts.Declaration | undefined): string | undefined;
    Get(id: string): TItem | undefined;

    Registry: Map<string, Map<string, TItem>>;

    // GetDeclarationById(id: string): TItem | undefined;
    // GetSymbolDeclarations(symbolId: number): ReadonlyArray<TItem>;
    // GetAllSymbols(): Readonly<Dictionary<TItem>>;
    // FindKey(symbol: ts.Symbol | undefined, declaration: ts.Declaration): string | undefined;
    // HasDeclaration(symbol: ts.Symbol | undefined, declaration?: ts.Declaration): boolean;
    // HasSymbol(symbol: ts.Symbol | undefined): boolean;
    // Extract(): void;
}

export interface Registry<TItem> extends ReadonlyRegistry<TItem> {
    AddItem(item: TItem): string;
}
