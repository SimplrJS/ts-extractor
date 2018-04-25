import { LazyGetter } from "typescript-lazy-get-decorator";
import { LoggerBuilder } from "simplr-logger";

import { AstSymbol } from "./ast-symbol";
import { AstItem, AstItemKind } from "../contracts/ast-item";

export interface AstSymbolsContainerOptions {
    logger: LoggerBuilder;
}

export class AstSymbolsContainer implements AstItem<AstSymbol[], {}> {
    constructor(options: AstSymbolsContainerOptions) {
        this.logger = options.logger;
    }

    protected readonly logger: LoggerBuilder;

    @LazyGetter()
    public get id(): string {
        for (const item of this.item) {
            return item.id;
        }

        this.logger.Error("Failed to resolve AstSymbolsContainer's id.");
        return "__UNRESOLVED-ID";
    }

    public readonly itemKind: AstItemKind = AstItemKind.SymbolsContainer;

    private items: AstSymbol[] = [];

    public get item(): AstSymbol[] {
        return this.items;
    }

    /**
     * Used by AstRegistry.
     * @internal
     */
    public addAstSymbol(astSymbol: AstSymbol): void {
        this.item.push(astSymbol);
    }

    public extract(): {} {
        throw new Error("Method not implemented.");
    }
}
