import * as ts from "typescript";

import { ApiItem } from "../abstractions/api-item";
import { ApiHelpers } from "../api-helpers";
import { ApiDefinitionKind, ApiClassDto } from "../contracts/api-definitions";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiType } from "../contracts/api-types";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiClass extends ApiItem<ts.ClassDeclaration, ApiClassDto> {
    private location: ApiItemLocationDto;
    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: ApiType | undefined;
    private implements: ApiType[] = [];
    private typeParameters: ApiItemReference[] = [];
    private members: ApiItemReference[] = [];
    private isAbstract: boolean = false;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);

        // Extends
        if (this.Declaration.heritageClauses != null) {
            const extendingList = ApiTypeHelpers.GetHeritageList(
                this.Options,
                this.location,
                this.Declaration.heritageClauses,
                ts.SyntaxKind.ExtendsKeyword
            );

            if (extendingList.length > 0) {
                this.extends = extendingList[0];
            }
        }

        // Implements
        if (this.Declaration.heritageClauses != null) {
            this.implements = ApiTypeHelpers.GetHeritageList(
                this.Options,
                this.location,
                this.Declaration.heritageClauses,
                ts.SyntaxKind.ImplementsKeyword
            );
        }

        // IsAbstract
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    public OnExtract(): ApiClassDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiDefinitionKind.Class,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            IsAbstract: this.isAbstract,
            Members: this.members,
            Extends: this.extends,
            Implements: this.implements,
            TypeParameters: this.typeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
