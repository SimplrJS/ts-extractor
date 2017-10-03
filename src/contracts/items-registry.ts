export interface ItemsRegistry<TItem, TDeclaration> {
    Get(id: string): TItem | undefined;
    Add(item: TItem): string;
    Find(declaration: TDeclaration): string | undefined;
}
