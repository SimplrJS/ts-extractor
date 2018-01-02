import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiItem } from "../abstractions/api-item";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiGetAccessorDto } from "../contracts/definitions/api-get-accessor-dto";
import { TypeDto } from "../contracts/type-dto";

export class ApiGetAccessor extends ApiItem<ts.GetAccessorDeclaration, ApiGetAccessorDto> {
    private type: TypeDto;

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public OnExtract(): ApiGetAccessorDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.GetAccessor,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Type: this.type
        };
    }
}
