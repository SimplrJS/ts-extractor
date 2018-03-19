import * as ts from "typescript";
import { AstItemBaseDto } from "../contracts/ast-item";

export enum AstItemStatus {
    Initial = 0,
    GatheredMembers = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = GatheredMembers | Extracted
}

export interface AstItemOptions {
    program: ts.Program;
    /**
     * Api item's parent id.
     */
    parentId?: string;
}

export abstract class AstItemBase<TExtractDto extends AstItemBaseDto> {
    constructor(protected readonly options: AstItemOptions) {}

    private status: AstItemStatus = AstItemStatus.Initial;

    public get itemStatus(): AstItemStatus {
        return this.status;
    }

    private extractedData: TExtractDto | undefined;
    protected abstract onExtract(): TExtractDto;

    /**
     * Extract api item's data to JSON.
     */
    public extract(): TExtractDto {
        if (this.itemStatus === AstItemStatus.Initial || this.extractedData == null) {
            this.extractedData = this.onExtract();
            this.status |= AstItemStatus.Extracted;
        }
        return this.extractedData;
    }

    protected abstract onGatherMembers(): void;

    /**
     * Used only in the extraction phase to prevent from circular references.
     */
    public gatherMembers(): void {
        if (this.itemStatus & AstItemStatus.GatheredMembers) {
            return;
        }
        this.onGatherMembers();
        this.status |= AstItemStatus.GatheredMembers;
    }
}
