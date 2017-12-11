import * as ts from "typescript";
import { ApiItem } from "./abstractions/api-item";
import { Dictionary } from "./contracts/dictionary";
import { Registry } from "./contracts/registry";
import { ApiItemDto } from "./contracts/api-item-dto";

export type ExtractedApiRegistry = Dictionary<ApiItemDto>;

export class ApiRegistry implements Registry<ApiItem> {
    protected registry: Map<string, ApiItem> = new Map<string, ApiItem>();

    protected ExtractedData: ExtractedApiRegistry = {};
    protected IsDataExtracted: boolean = false;

    public Extract(forceExtract: boolean = false): ExtractedApiRegistry {
        if (this.IsDataExtracted && !forceExtract) {
            return this.ExtractedData;
        }

        for (const [key, apiItem] of this.Registry) {
            const extractedData = apiItem.Extract(forceExtract);

            this.ExtractedData[key] = extractedData as ApiItemDto;
        }

        this.IsDataExtracted = true;
        return this.ExtractedData;
    }

    public get Registry(): ReadonlyMap<string, ApiItem> {
        return this.registry as ReadonlyMap<string, ApiItem>;
    }

    private declarationsToIdsMap: WeakMap<ts.Declaration, string> = new WeakMap<ts.Declaration, string>();
    private counters: Map<string, number> = new Map<string, number>();

    protected GetNextDeclarationId(declaration: ts.Declaration | undefined): string | undefined {
        if (declaration == null) {
            return undefined;
        }

        // Get string syntax kind
        const syntaxKind = ts.SyntaxKind[declaration.kind];

        let index: number;
        if (this.counters.has(syntaxKind)) {
            const oldIndex = this.counters.get(syntaxKind)!;
            index = oldIndex + 1;
        } else {
            index = 0;
        }

        this.counters.set(syntaxKind, index);
        return `${syntaxKind}-${index}`;
    }

    public GetDeclarationId(declaration: ts.Declaration): string | undefined {
        return this.declarationsToIdsMap.get(declaration);
    }

    public HasDeclaration(declaration: ts.Declaration): boolean {
        const declarationId = this.GetDeclarationId(declaration);
        return declarationId != null && this.registry.has(declarationId);
    }

    public Get(id: string): ApiItem | undefined {
        if (id == null) {
            return undefined;
        }
        return this.registry.get(id);
    }

    public AddItem(item: ApiItem): string {
        const declarationId = this.GetNextDeclarationId(item.Declaration);

        if (declarationId == null) {
            throw new Error(`Declaration id should always be deterministic.`);
        }

        if (!this.registry.has(declarationId)) {
            this.registry.set(declarationId, item);
            this.declarationsToIdsMap.set(item.Declaration, declarationId);
            this.IsDataExtracted = false;
        }

        item.GatherData();

        return declarationId;
    }
}
