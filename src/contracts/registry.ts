import * as ts from "typescript";

export interface ReadonlyRegistry<TItem> {
    Extract(): void;
    HasDeclaration(declaration: ts.Declaration | undefined): boolean;
    GetDeclarationId(declaration: ts.Declaration | undefined): string | undefined;
    Get(id: string): TItem | undefined;
    Registry: ReadonlyMap<string, TItem>;
}

export interface Registry<TItem> extends ReadonlyRegistry<TItem> {
    AddItem(item: TItem): string;
}
