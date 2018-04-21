import * as ts from "typescript";
import { AstItemMemberReference } from "../contracts/ast-item";
import { ReadonlyAstRegistry } from "../ast-registry";
import { LoggerBuilder } from "simplr-logger";
import { AstTypeIdentifiers } from "../contracts/ast-type";
import { AstDeclarationIdentifiers } from "../contracts/ast-declaration";

export enum AstItemStatus {
    Initial = 0,
    GatheredMembers = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = GatheredMembers | Extracted
}

export interface GatheredMembersResult {
    [key: string]: AstItemMemberReference | AstItemMemberReference[] | undefined;
}

export interface AstItemOptions {
    program: ts.Program;
    projectDirectory: string;
    itemsRegistry: ReadonlyAstRegistry;
    logger: LoggerBuilder;
    resolveAstDeclaration: (
        declaration: ts.Declaration,
        symbol: ts.Symbol,
        identifiers?: AstDeclarationIdentifiers
    ) => AstItemBase<ts.Declaration, any, any>;
    resolveAstType: (type: ts.Type, typeNode: ts.TypeNode | undefined, identifiers: AstTypeIdentifiers) => AstItemBase<ts.Type, any, any>;
}

export interface AstItemGatherMembersOptions {
    addAstItemToRegistry: (item: AstItemBase<any, any, any>) => void;
}

export abstract class AstItemBase<TItem, TGatherResult extends GatheredMembersResult, TExtractedData> {
    constructor(protected readonly options: AstItemOptions, public readonly item: TItem) {
        this.logger = options.logger;
        this.typeChecker = options.program.getTypeChecker();
    }

    protected readonly logger: LoggerBuilder;
    protected readonly typeChecker: ts.TypeChecker;

    private status: AstItemStatus = AstItemStatus.Initial;

    public get itemStatus(): AstItemStatus {
        return this.status;
    }

    public abstract readonly id: string;
    public abstract readonly itemKind: string;

    private extractedData: TExtractedData | undefined;
    protected abstract onExtract(): TExtractedData;

    /**
     * Extract api item's data to JSON.
     */
    public extract(): TExtractedData {
        if (this.itemStatus === AstItemStatus.Initial || this.extractedData == null) {
            this.extractedData = this.onExtract();
            this.status |= AstItemStatus.Extracted;
        }

        return this.extractedData;
    }

    private gatheredMembersResult: TGatherResult | undefined;

    protected get gatheredMembers(): TGatherResult {
        if (this.gatheredMembersResult == null) {
            this.gatheredMembersResult = this.getDefaultGatheredMembers();
        }

        return this.gatheredMembersResult;
    }

    protected abstract getDefaultGatheredMembers(): TGatherResult;

    protected abstract onGatherMembers(options: AstItemGatherMembersOptions): TGatherResult;

    /**
     * Used only in the extraction phase to prevent from circular references.
     */
    public gatherMembers(options: AstItemGatherMembersOptions): void {
        if (this.itemStatus & AstItemStatus.GatheredMembers) {
            return;
        }

        this.gatheredMembersResult = this.onGatherMembers(options);
        this.status |= AstItemStatus.GatheredMembers;
    }
}
