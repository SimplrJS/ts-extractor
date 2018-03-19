import * as ts from "typescript";
import { AstItemBaseDto, AstItemMemberReference } from "../contracts/ast-item";

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

export abstract class AstItemBase<TExtractDto extends AstItemBaseDto, TItem> {
    constructor(protected readonly options: AstItemOptions, protected readonly item: TItem) {
        this.parentId = this.options.parentId;
    }

    protected get typeChecker(): ts.TypeChecker {
        return this.options.program.getTypeChecker();
    }

    private status: AstItemStatus = AstItemStatus.Initial;

    public get itemStatus(): AstItemStatus {
        return this.status;
    }

    /**
     * This name will be used for Id generating.
     */
    public readonly abstract name: string;

    public readonly parentId: string | undefined;

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

    protected membersReferences: AstItemMemberReference[] | undefined;

    protected abstract onGatherMembers(): AstItemMemberReference[];

    /**
     * Used only in the extraction phase to prevent from circular references.
     */
    public gatherMembers(): void {
        if (this.itemStatus & AstItemStatus.GatheredMembers) {
            return;
        }
        this.membersReferences = this.onGatherMembers();
        this.status |= AstItemStatus.GatheredMembers;
    }
}
