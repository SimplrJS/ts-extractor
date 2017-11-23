import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiEnumMemberDto } from "../contracts/definitions/api-enum-member-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiEnumMember extends ApiItem<ts.EnumMember, ApiEnumMemberDto> {
    public GetValue(): string {
        const firstToken: ts.Node | undefined = this.Declaration ? this.Declaration.getFirstToken() : undefined;
        const lastToken: ts.Node | undefined = this.Declaration ? this.Declaration.getLastToken() : undefined;
        const declaration: ts.EnumMember = this.Declaration;
        /**
         * TODO: Find a way to get value from this enum:
         * ```tsx
         * export enum ListOfItems {
         *     First,
         *     Second,
         *     Third
         * }
         * ```
         */
        if (lastToken == null || lastToken === firstToken) {
            return "";
        }

        return lastToken.getText();
    }

    protected OnGatherData(): void {
        // No gathering is needed
    }

    public OnExtract(): ApiEnumMemberDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);
        const value: string = this.GetValue();

        return {
            ApiKind: ApiItemKinds.EnumMember,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Value: value
        };
    }
}
