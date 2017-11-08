import * as ts from "typescript";
import { Dictionary } from "./dictionary";

export interface ReadonlyRegistry<TItem> {
    GetDeclarationById(id: string): TItem | undefined;
    GetSymbolDeclarations(symbolId: number): ReadonlyArray<TItem>;
    GetAllSymbols(): Readonly<Dictionary<TItem>>;
    FindKey(symbol: ts.Symbol | undefined, declaration: ts.Declaration): string | undefined;
    HasDeclaration(symbol: ts.Symbol | undefined, declaration?: ts.Declaration): boolean;
    HasSymbol(symbol: ts.Symbol | undefined): boolean;
}

export interface Registry<TItem> extends ReadonlyRegistry<TItem> {
    AddDeclaration(symbol: ts.Symbol, declaration: TItem): string;
}
