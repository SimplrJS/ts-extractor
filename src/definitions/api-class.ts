import * as ts from "typescript";

import { ApiItem } from "../abstractions/api-item";
import { ApiHelpers } from "../api-helpers";
import { ApiClassDto } from "../contracts/definitions/api-class-dto";
import { ApiItemReferenceTuplesList } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiClass extends ApiItem<ts.ClassDeclaration, ApiClassDto> {
    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: TypeDto | undefined;
    private implements: TypeDto[] = [];
    private typeParameters: ApiItemReferenceTuplesList = [];
    private members: ApiItemReferenceTuplesList = [];
    private isAbstract: boolean = false;

    protected OnGatherData(): void {
        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);

        // Extends
        if (this.Declaration.heritageClauses != null) {
            const extendingList = ApiHelpers.GetHeritageList(this.Declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, this.Options);

            if (extendingList.length > 0) {
                this.extends = extendingList[0];
            }
        }

        // Implements
        if (this.Declaration.heritageClauses != null) {
            this.implements = ApiHelpers.GetHeritageList(this.Declaration.heritageClauses, ts.SyntaxKind.ImplementsKeyword, this.Options);
        }

        // IsAbstract
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    public OnExtract(): ApiClassDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Class,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            IsAbstract: this.isAbstract,
            Members: this.members,
            Extends: this.extends,
            Implements: this.implements,
            TypeParameters: this.typeParameters
        };
    }
}
