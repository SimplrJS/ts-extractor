import * as ts from "typescript";
import { Dictionary } from "./dictionary";

export interface ReadonlyRegistry<TItem> {
    // Extraction
    Extract(): void;

    // Existance checks
    HasDeclaration(declaration: ts.Declaration | undefined): boolean;

    GetDeclarationId(declaration: ts.Declaration | undefined): string | undefined;
    Get(id: string): TItem | undefined;

    Registry: ReadonlyMap<string, TItem>;

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
