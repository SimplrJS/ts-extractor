import * as ts from "typescript";
import {
    GatheredMembersResult,
    AstItemOptions,
    AstItemStatus,
    AstItemGatherMembersOptions,
    AstItem,
    AstItemKind
} from "../contracts/ast-item";
import { LoggerBuilder } from "simplr-logger";

export abstract class AstItemBase<TItem, TGatherResult extends GatheredMembersResult, TExtractedData>
    implements AstItem<TItem, TExtractedData> {
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
    public abstract readonly itemKind: AstItemKind;

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

        this.logger.Debug(`${this.constructor.name} [${this.id}] Gathering members.`);
        this.gatheredMembersResult = this.onGatherMembers(options);
        this.status |= AstItemStatus.GatheredMembers;
    }
}
