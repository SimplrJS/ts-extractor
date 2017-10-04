import * as ts from "typescript";
import { ApiItem } from "./abstractions/api-item";
import { ItemsRegistry, RegistryDict } from "./contracts/items-registry";

export class ApiItemsRegistry implements ItemsRegistry<ApiItem, ts.Declaration> {
    private registry: RegistryDict<ApiItem> = {};
    private counts: { [id: string]: number } = {};

    public GetAll(): RegistryDict<ApiItem> {
        return this.registry;
    }

    public Get(id: string): ApiItem | undefined {
        return this.registry[id];
    }

    public Add(item: ApiItem): string {
        const id = this.getNextId(item.Declaration.kind);
        this.registry[id] = item;

        return id;
    }

    public Find(declaration: ts.Declaration): string | undefined {
        let foundId: string | undefined;
        Object.keys(this.registry).forEach(itemId => {
            const item = this.registry[itemId];
            if (item.Declaration === declaration) {
                foundId = itemId;
                return false;
            }
        });

        return foundId;
    }

    private getNextId(kind: ts.SyntaxKind): string {
        const stringKind = ts.SyntaxKind[kind];
        if (this.counts[stringKind] == null) {
            this.counts[stringKind] = 0;
        }
        const count = this.counts[stringKind]++;

        return `${stringKind}-${count}`;
    }
}
