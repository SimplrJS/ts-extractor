import * as ts from "typescript";
import { AstDeclarationBase } from "./ast-declaration-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";
import { AstSymbol } from "./ast-symbol";

export interface AstFunctionDto extends AstItemBaseDto {
    returnType: any;
}

export class AstFunction extends AstDeclarationBase<AstFunctionDto, ts.FunctionDeclaration> {
    public get itemKind(): AstItemKind {
        return AstItemKind.Function;
    }

    public get name(): string {
        if (this.item.name == null) {
            return "???";
        }

        return this.item.name.getText();
    }

    protected onExtract(): AstFunctionDto {
        return {
            name: this.name,
            returnType: {}
        };
    }

    public get parameters(): AstSymbol[] {
        return this.parametersReferences.map(x => this.options.itemsRegistry.get(x.id)) as AstSymbol[];
    }

    private parametersReferences: AstItemMemberReference[] = [];

    protected onGatherMembers(): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];

        for (const parameter of this.item.parameters) {
            const symbol = TsHelpers.GetSymbolFromDeclaration(parameter, this.typeChecker);

            if (symbol != null) {
                const astSymbol = new AstSymbol(
                    {
                        ...this.options,
                        parentId: this.itemId
                    },
                    symbol
                );

                if (!this.options.itemsRegistry.has(astSymbol.itemId)) {
                    this.options.addItemToRegistry(astSymbol);
                }
                membersReferences.push({ alias: astSymbol.name, id: astSymbol.itemId });
                this.parametersReferences.push({ alias: astSymbol.name, id: astSymbol.itemId });
            }
        }

        return membersReferences;
    }
}
