import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/definitions/api-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiProperty extends ApiItem<ts.PropertySignature, ApiPropertyDto> {
    private type: TypeDto;
    private isOptional: boolean;
    private isReadonly: boolean;

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);

        // IsReadonly
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);
    }

    public OnExtract(): ApiPropertyDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Property,
            Name: this.Symbol.name,
            Metadata: metadata,
            Location: location,
            IsOptional: this.isOptional,
            IsReadonly: this.isReadonly,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
