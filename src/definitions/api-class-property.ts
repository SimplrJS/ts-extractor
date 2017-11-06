import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassPropertyDto } from "../contracts/definitions/api-class-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { AccessModifier } from "../contracts/access-modifier";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiClassProperty extends ApiItem<ts.PropertyDeclaration, ApiClassPropertyDto> {
    constructor(declaration: ts.PropertyDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.StaticKeyword);
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);

        // Type
        if (declaration.type != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(declaration.type);

            this.type = ApiHelpers.TypeToApiTypeDto(type, options);
        }
    }

    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private isReadonly: boolean;
    private type: TypeDto | undefined;

    public IsPrivate(): boolean {
        return super.IsPrivate() || this.accessModifier === AccessModifier.Private;
    }

    public Extract(): ApiClassPropertyDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.ClassProperty,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Type: this.type,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsReadonly: this.isReadonly,
            IsStatic: this.isStatic
        };
    }
}
