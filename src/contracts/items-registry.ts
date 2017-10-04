export type RegistryDict<TItem> = { [key: string]: TItem };

export interface ItemsRegistry<TItem, TDeclaration> {
    Get(id: string): TItem | undefined;
    GetAll(): RegistryDict<TItem>;
    Add(item: TItem): string;
    Find(declaration: TDeclaration): string | undefined;
}
