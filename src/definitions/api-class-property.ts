import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassPropertyDto } from "../contracts/definitions/api-class-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { AccessModifier } from "../contracts/access-modifier";

export class ApiClassProperty extends ApiItem<ts.PropertyDeclaration, ApiClassPropertyDto> {
    constructor(declaration: ts.PropertyDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.StaticKeyword);
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);
    }

    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private isReadonly: boolean;

    public IsPrivate(): boolean {
        return super.IsPrivate() || this.accessModifier === AccessModifier.Private;
    }

    public GetReturnType(): TypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiClassPropertyDto {
        return {
            ApiKind: ApiItemKinds.ClassProperty,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: this.GetItemMeta(),
            Type: this.GetReturnType(),
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsReadonly: this.isReadonly,
            IsStatic: this.isStatic
        };
    }
}
