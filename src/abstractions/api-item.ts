import * as ts from "typescript";

import { ApiBaseDefinition, TypeScriptTypeDeclarationDebug } from "../contracts/api-definitions";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ExtractorOptions } from "../contracts/extractor-options";
import { ReadonlyRegistry } from "../contracts/registry";

export interface ApiItemOptions {
    Program: ts.Program;
    ExtractorOptions: ExtractorOptions;
    ExternalPackages: string[];
    Registry: ReadonlyRegistry<ApiItem>;
    AddItemToRegistry(item: ApiItem<ts.Declaration, any>): string;
}

export enum ApiItemStatus {
    Initial = 0,
    Gathered = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = Gathered | Extracted
}

export abstract class ApiItem<TDeclaration extends ts.Declaration = ts.Declaration, TExtractDto = ApiBaseDefinition> {
    constructor(private declaration: TDeclaration, private symbol: ts.Symbol, private options: ApiItemOptions) {
        this.TypeChecker = options.Program.getTypeChecker();
    }

    protected TypeChecker: ts.TypeChecker;
    protected ItemStatus: ApiItemStatus = ApiItemStatus.Initial;
    protected ExtractedData: TExtractDto;

    public GetItemMetadata(): ApiMetadataDto {
        return {
            DocumentationComment: ts.displayPartsToString(this.Symbol.getDocumentationComment()),
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
     * It gives precise TypeScript information about item after extracting.
     */
    protected GetTsDebugInfo(): TypeScriptTypeDeclarationDebug | undefined {
        if (this.Options.ExtractorOptions.IncludeTsDebugInfo) {
            return {
                Kind: this.Declaration.kind,
                KindString: ts.SyntaxKind[this.Declaration.kind]
            };
        }

        return undefined;
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
