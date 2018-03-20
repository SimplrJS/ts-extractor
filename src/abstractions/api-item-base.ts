import * as ts from "typescript";
import { LoggerBuilder } from "simplr-logger";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";

export enum AstItemStatus {
    Initial = 0,
    GatheredMembers = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = GatheredMembers | Extracted
}

export interface AddItemToRegistryHandler {
    (item: AstItemBase<any, any>): void;
}

export interface AstItemOptions {
    program: ts.Program;
    /**
     * Api item's parent id.
     */
    parentId: string;
    /**
     * Used to identify AstItem when it has the same name and kind.
     * For example function overloads.
     */
    itemCounter?: number;
    projectDirectory: string;
    addItemToRegistry: AddItemToRegistryHandler;
    itemsRegistry: ReadonlyMap<string, AstItemBase<any, any>>;
    logger: LoggerBuilder;
}

export abstract class AstItemBase<TExtractDto extends AstItemBaseDto, TItem> {
    constructor(protected readonly options: AstItemOptions, protected readonly item: TItem) {
        this.parentId = options.parentId;
        this.logger = options.logger;
    }

    protected readonly logger: LoggerBuilder;

    protected get typeChecker(): ts.TypeChecker {
        return this.options.program.getTypeChecker();
    }

    private status: AstItemStatus = AstItemStatus.Initial;

    public get itemStatus(): AstItemStatus {
        return this.status;
    }

    public abstract readonly itemKind: string;

    public get itemId(): string {
        const counter: string = this.options.itemCounter != null ? `&${this.options.itemCounter}` : "";
        return `${this.parentId}.${this.name}#${this.itemKind}${counter}`;
    }

    /**
     * This name will be used for Id generating.
     */
    public abstract readonly name: string;

    public readonly parentId: string;

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
