import * as ts from "typescript";

import { Dictionary } from "../contracts/dictionary";
import { ApiBaseItemDto } from "../contracts/api-base-item-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export interface ApiItemOptions {
    Program: ts.Program;
    ItemsRegistry: Dictionary<ApiItem, ts.Declaration>;
    ProjectDirectory: string;
    OutputPathSeparator: string;
    Exclude: string[];
}

export enum ApiItemStatus {
    Initial,
    Extracted
}

export abstract class ApiItem<TDeclaration = ts.Declaration, TExtractDto = ApiBaseItemDto> {
    constructor(private declaration: TDeclaration, private symbol: ts.Symbol, private options: ApiItemOptions) {
        this.TypeChecker = options.Program.getTypeChecker();
    }

    protected TypeChecker: ts.TypeChecker;
    protected ItemStatus: ApiItemStatus;
    protected ExtractedData: TExtractDto;

    protected GetItemMetadata(): ApiMetadataDto {
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

    public get Status(): ApiItemStatus {
        return this.ItemStatus;
    }

    /**
     * If ApiItem is private, it will not appear in extracted data.
     */
    public IsPrivate(): boolean {
        return false;
    }

    public abstract OnExtract(): TExtractDto;

    public Extract(forceExtraction: boolean = false): TExtractDto {
        if (this.Status === ApiItemStatus.Initial || forceExtraction) {
            this.ExtractedData = this.OnExtract();
            this.ItemStatus = ApiItemStatus.Extracted;
        }
        return this.ExtractedData;
    }
}
