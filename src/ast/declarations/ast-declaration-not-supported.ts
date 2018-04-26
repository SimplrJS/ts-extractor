import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemKind, AstItemGatherMembersOptions, GatheredMembersResult } from "../../contracts/ast-item";

export class AstDeclarationNotSupported extends AstDeclarationBase<ts.Declaration | ts.NamedDeclaration, {}, {}> {
    private static counter: number = 0;

    /**
     * Used for generating unique id's.
     * @internal
     */
    public static getNextNumber(): number {
        return this.counter++;
    }

    public readonly itemKind: AstItemKind = AstItemKind.DeclarationNotSupported;

    private isNamedDeclaration(declaration: ts.Declaration | ts.NamedDeclaration): declaration is ts.NamedDeclaration {
        return (declaration as ts.NamedDeclaration).name != null;
    }

    @LazyGetter()
    public get id(): string {
        const parentId: string = this.identifiers.parentId != null ? this.identifiers.parentId : this.parent.id;
        const counter: string = `#${AstDeclarationNotSupported.getNextNumber()}`;

        return `${parentId}#${this.itemKind}${counter}`;
    }

    @LazyGetter()
    public get name(): string {
        if (this.isNamedDeclaration(this.item) && this.item.name != null) {
            return this.item.name.getText();
        }

        return this.parent.name;
    }

    protected onExtract(): {} {
        return {};
    }

    protected getDefaultGatheredMembers(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): GatheredMembersResult {
        return {};
    }
}
