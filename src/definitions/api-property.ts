import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/definitions/api-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiProperty extends ApiItem<ts.PropertySignature, ApiPropertyDto> {
    private type: TypeDto;
    private isOptional: boolean;

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);
    }

    public OnExtract(): ApiPropertyDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = this.GetDeclarationLocation();

        return {
            ApiKind: ApiItemKinds.Property,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            IsOptional: this.isOptional,
            Type: this.type
        };
    }
}
