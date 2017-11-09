import * as ts from "typescript";
import { ApiItem } from "./abstractions/api-item";
import { Dictionary } from "./contracts/dictionary";
import { Registry } from "./contracts/registry";
import { ApiBaseItemDto } from "./contracts/api-base-item-dto";

export type ExtractedApiRegistry = Dictionary<ApiBaseItemDto>;

export class ApiRegistry implements Registry<ApiItem> {
    protected registry: Map<string, ApiItem> = new Map<string, ApiItem>();

    protected ExtractedData: ExtractedApiRegistry = {};
    protected IsDataExtracted: boolean = false;

    public Extract(forceExtract: boolean = false): ExtractedApiRegistry {
        if (this.IsDataExtracted && !forceExtract) {
            return this.ExtractedData;
        }

        for (const item of this.Registry) {
            const [key, apiItem] = item;
            const extractedData = apiItem.Extract(forceExtract);

            this.ExtractedData[key] = extractedData;
        }

        this.IsDataExtracted = true;
        return this.ExtractedData;
    }

    public get Registry(): ReadonlyMap<string, ApiItem> {
        return this.registry as ReadonlyMap<string, ApiItem>;
    }

    private declarationsToIdsMap: WeakMap<ts.Declaration, string> = new WeakMap<ts.Declaration, string>();
    private counters: WeakMap<ts.Declaration, number> = new WeakMap<ts.Declaration, number>();

    protected GenerateDeclarationId(declaration: ts.Declaration | undefined): string | undefined {
        if (declaration == null) {
            return undefined;
        }

        // Get string syntax kind
        const syntaxKind = ts.SyntaxKind[declaration.kind];

        if (!this.counters.has(declaration)) {
            this.counters.set(declaration, 0);
        }

        const index = this.counters.get(declaration)! + 1;
        this.counters.set(declaration, index);

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
        const declarationId = this.GenerateDeclarationId(item.Declaration);

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
