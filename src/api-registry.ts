import * as ts from "typescript";
import { ApiItem } from "./abstractions/api-item";
import { Dictionary } from "./contracts/dictionary";
import { Registry } from "./contracts/registry";

export class ApiRegistry implements Registry<ApiItem> {
    constructor(autoExtract: boolean = true) {
        this.autoExtract = autoExtract;
    }

    private separator = ".";
    protected registry: Map<string, Map<string, ApiItem>> = new Map<string, Map<string, ApiItem>>();

    public readonly autoExtract: boolean;
    public Extract(): void {
        throw new Error("Method not implemented.");
    }

    public get Registry(): Map<string, Map<string, ApiItem>> {
        return this.registry;
    }

    private symbolsToIdsMap = new Map<ts.Symbol, string>();
    private counters: { [index: string]: number } = {};

    public GetSymbolId(symbol: ts.Symbol): string {
        if (this.symbolsToIdsMap.has(symbol)) {
            const symbolId = this.symbolsToIdsMap.get(symbol);
            if (symbolId != null) {
                return symbolId;
            }
        }

        const escapedName = symbol.escapedName.toString();
        if (this.counters[escapedName] == null) {
            this.counters[escapedName] = 0;
        }

        const symbolCounter = this.counters[escapedName]++;

        const symbolId = `${symbol.escapedName}${symbolCounter}`;
        return symbolId;
    }

    public GetDeclarationId(symbol: ts.Symbol | undefined, declaration: ts.Declaration | undefined): string | undefined {
        if (symbol == null || declaration == null) {
            return undefined;
        }

        const symbolId = this.GetSymbolId(symbol);

        if (symbol.declarations == null) {
            return undefined;
        }

        const declarationKey = symbol.declarations.findIndex(x => x === declaration);
        if (declarationKey === -1) {
            return undefined;
        }

        const syntaxKind = ts.SyntaxKind[declaration.kind];

        return `${symbolId}${this.separator}${syntaxKind}-${declarationKey}`;
    }

    public HasSymbol(symbol: ts.Symbol | undefined): boolean {
        if (symbol == null) {
            return false;
        }

        const symbolId = this.GetSymbolId(symbol);
        return this.registry.has(symbolId);
    }
    public HasDeclaration(symbol: ts.Symbol | undefined, declaration: ts.Declaration | undefined): boolean {
        if (!this.HasSymbol(symbol)) {
            return false;
        }

        // Undefined check inside HasSymbol
        const symbolId = this.GetSymbolId(symbol!);
        const items = this.registry.get(symbolId);

        // Should never happen
        if (items == null) {
            return false;
        }

        const declarationId = this.GetDeclarationId(symbol, declaration);

        return declarationId != null && items.has(declarationId);
    }

    public Get(id: string): ApiItem | undefined {
        const splitId = id.split(this.separator);
        if (splitId.length < 2) {
            throw new Error(`Id "${id}" is incorrect.`);
        }

        const [symbolId] = splitId;
        if (!this.registry.has(symbolId)) {
            return undefined;
        }

        const items = this.registry.get(symbolId);
        if (items == null) {
            return undefined;
        }

        return items.get(id);
    }

    public AddItem(item: ApiItem): string {
        const symbolId = this.GetSymbolId(item.Symbol);

        const declarationId = this.GetDeclarationId(item.Symbol, item.Declaration);

        if (declarationId == null) {
            throw new Error(`Declaration id should always be deterministic.`);
        }

        let items: Map<string, ApiItem>;
        if (!this.registry.has(symbolId)) {
            items = new Map<string, ApiItem>();
        } else {
            items = this.registry.get(symbolId)!;
        }

        items.set(declarationId, item);
        this.registry = this.registry.set(symbolId, items);

        return declarationId;
    }
}
