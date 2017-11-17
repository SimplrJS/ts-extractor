import * as ts from "typescript";
import { LogLevel } from "simplr-logger";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiIndexDto } from "../contracts/definitions/api-index-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiIndex extends ApiItem<ts.IndexSignatureDeclaration, ApiIndexDto> {
    private parameter: string;
    private type: TypeDto;
    private isReadonly: boolean;

    protected OnGatherData(): void {
        // Parameter
        const parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);

        if (parameters.length !== 1) {
            // This should not happen, because we run Semantic Diagnostics before extraction.
            const message = `An index signature must have exactly one parameter, it has ${parameters.length}.`;
            ApiHelpers.LogWithDeclarationPosition(
                LogLevel.Error,
                this.Declaration,
                message
            );
            throw new Error(message);
        } else {
            const [name, references] = parameters[0];

            if (references.length === 0) {
                ApiHelpers.LogWithDeclarationPosition(
                    LogLevel.Error,
                    this.Declaration,
                    "An index signature parameter has more than one declaration."
                );
            } else {
                this.parameter = references[0];
            }
        }

        // Type
        if (this.Declaration.type == null) {
            // This should not happen, because we run Semantic Diagnostics before extraction.
            throw new Error("An index signature must have a type annotation.");
        }
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        // Modifiers
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);
    }

    public OnExtract(): ApiIndexDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Index,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameter: this.parameter,
            IsReadonly: this.isReadonly,
            Type: this.type
        };
    }
}
