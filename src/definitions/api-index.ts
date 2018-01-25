import * as ts from "typescript";
import { LogLevel } from "simplr-logger";

import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiIndexDto } from "../contracts/definitions/api-index-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiType } from "../contracts/api-type";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiIndex extends ApiItem<ts.IndexSignatureDeclaration, ApiIndexDto> {
    private location: ApiItemLocationDto;
    private parameter: string;
    private type: ApiType;
    private isReadonly: boolean;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Parameter
        const parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);

        if (parameters.length !== 1) {
            const message = `An index signature must have exactly one parameter, it has ${parameters.length}.`;
            ApiHelpers.LogWithNodePosition(
                LogLevel.Error,
                this.Declaration,
                message
            );
        } else {
            this.parameter = parameters[0].Ids[0];
        }

        /**
         * Type
         * getTypeFromTypeNode method handles undefined and returns `any` type.
         */
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type!);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.type);

        // Modifiers
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);
    }

    public OnExtract(): ApiIndexDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Index,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            Parameter: this.parameter,
            IsReadonly: this.isReadonly,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
