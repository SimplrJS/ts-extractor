import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiConstructDto } from "../contracts/definitions/api-construct-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKinds } from "../contracts/api-item-kinds";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiConstruct extends ApiItem<ts.ConstructSignatureDeclaration, ApiConstructDto> {
    private isOverloadBase: boolean;
    private parameters: ApiItemReference[] = [];

    protected OnGatherData(): void {
        // Overload
        this.isOverloadBase = this.TypeChecker.isImplementationOfOverload(this.Declaration) || false;

        // Parameters
        this.parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);
    }

    public OnExtract(): ApiConstructDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Construct,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            IsOverloadBase: this.isOverloadBase,
            Parameters: this.parameters
        };
    }
}
