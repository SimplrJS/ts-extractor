import * as ts from "typescript";
import { LogLevel } from "simplr-logger";

import { ApiHelpers } from "../api-helpers";
import { ApiItem } from "../abstractions/api-item";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiSetAccessorDto } from "../contracts/definitions/api-set-accessor-dto";
import { ApiItemReference } from "../contracts/api-item-reference";

export class ApiSetAccessor extends ApiItem<ts.SetAccessorDeclaration, ApiSetAccessorDto> {
    private parameter: ApiItemReference | undefined;

    protected OnGatherData(): void {
        // Parameter
        const parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);

        if (parameters.length !== 1) {
            const message = `A 'set' accessor must have exactly one parameter, it has ${parameters.length}.`;
            ApiHelpers.LogWithNodePosition(
                LogLevel.Error,
                this.Declaration,
                message
            );
        } else {
            this.parameter = parameters[0];
        }
    }

    public OnExtract(): ApiSetAccessorDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.SetAccessor,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Parameter: this.parameter
        };
    }
}
