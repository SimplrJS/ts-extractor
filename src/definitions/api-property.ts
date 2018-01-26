import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/api-definitions";
import { ApiItemKind } from "../contracts/api-item-kind";
import { ApiType } from "../contracts/api-type";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiProperty extends ApiItem<ts.PropertySignature | ts.PropertyAssignment, ApiPropertyDto> {
    private location: ApiItemLocationDto;
    private type: ApiType;
    private isOptional: boolean;
    private isReadonly: boolean;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Type
        const typeNode: ts.TypeNode | undefined = ts.isPropertySignature(this.Declaration) ? this.Declaration.type : undefined;
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, typeNode);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);

        // IsReadonly
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);
    }

    public OnExtract(): ApiPropertyDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKind.Property,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            IsOptional: this.isOptional,
            IsReadonly: this.isReadonly,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
