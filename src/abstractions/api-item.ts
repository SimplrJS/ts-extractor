import * as ts from "typescript";

import { ItemsRegistry } from "../contracts/items-registry";
import { ApiBaseItemDto } from "../contracts/api-base-item-dto";
import { ApiMetadataDto } from "../contracts/api-meta-dto";

export interface ApiItemOptions {
    Program: ts.Program;
    ItemsRegistry: ItemsRegistry<ApiItem, ts.Declaration>;
    ProjectDirectory: string;
}

export abstract class ApiItem<TDeclaration = ts.Declaration, TExtract = ApiBaseItemDto> {
    constructor(private declaration: TDeclaration, private symbol: ts.Symbol, private options: ApiItemOptions) {
        this.TypeChecker = options.Program.getTypeChecker();
    }

    protected TypeChecker: ts.TypeChecker;

    protected GetItemMeta(): ApiMetadataDto {
        return {
            DocumentationComment: this.Symbol.getDocumentationComment(),
            JSDocTags: this.Symbol.getJsDocTags()
        };
    }

    public get Options(): ApiItemOptions {
        return this.options;
    }

    public get Declaration(): TDeclaration {
        return this.declaration;
    }

    public get Symbol(): ts.Symbol {
        return this.symbol;
    }

    /**
     * If ApiItem is private, it will not appear in extracted data.
     */
    public IsPrivate(): boolean {
        return false;
    }

    public abstract Extract(): TExtract;
}
