import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiConstructDto } from "../contracts/definitions/api-construct-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiConstruct extends ApiItem<ts.ConstructSignatureDeclaration, ApiConstructDto> {
    private parameters: ApiItemReferenceTuple = [];

    protected OnGatherData(): void {
        this.parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);
    }

    public OnExtract(): ApiConstructDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Construct,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Parameters: this.parameters
        };
    }
}
