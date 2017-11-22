import * as ts from "typescript";

import { Dictionary } from "../contracts/dictionary";
import { ApiBaseItemDto } from "../contracts/api-base-item-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ExtractorOptions } from "../contracts/extractor-options";
import { ReadonlyRegistry } from "../contracts/registry";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiHelpers } from "../api-helpers";

export interface ApiItemOptions {
    Program: ts.Program;
    ExtractorOptions: ExtractorOptions;
    Registry: ReadonlyRegistry<ApiItem>;
    AddItemToRegistry(item: ApiItem<ts.Declaration, any>): string;
}

export enum ApiItemStatus {
    Initial = 0,
    Gathered = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = Gathered | Extracted
}

export abstract class ApiItem<TDeclaration extends ts.Declaration = ts.Declaration, TExtractDto = ApiBaseItemDto> {
    constructor(private declaration: TDeclaration, private symbol: ts.Symbol, private options: ApiItemOptions) {
        this.TypeChecker = options.Program.getTypeChecker();
    }

    protected TypeChecker: ts.TypeChecker;
    protected ItemStatus: ApiItemStatus = ApiItemStatus.Initial;
    protected ExtractedData: TExtractDto;

    protected GetItemMetadata(): ApiMetadataDto {
        return {
            DocumentationComment: this.Symbol.getDocumentationComment(),
            JSDocTags: this.Symbol.getJsDocTags()
        };
    }

    protected GetDeclarationLocation(): ApiItemLocationDto {
        return ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.declaration, this.options);
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
     * If ApiItem is private, it will not appear in the extracted data.
     */
    public IsPrivate(): boolean {
        return false;
    }

    protected abstract OnExtract(): TExtractDto;

    public Extract(forceExtraction: boolean = false): TExtractDto {
        if (this.Status === ApiItemStatus.Initial || forceExtraction) {
            this.ExtractedData = this.OnExtract();
            this.ItemStatus = ApiItemStatus.Extracted;
        }
        return this.ExtractedData;
    }

    protected abstract OnGatherData(): void;

    public GatherData(forceGathering: boolean = false): void {
        if (this.ItemStatus & ApiItemStatus.Gathered) {
            return;
        }
        this.OnGatherData();
    }
}
