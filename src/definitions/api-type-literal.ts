import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiTypeLiteralDto } from "../contracts/definitions/api-type-literal-dto";
import { ApiItemKind } from "../contracts/api-item-kind";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiTypeLiteral extends ApiItem<ts.TypeLiteralNode | ts.ObjectLiteralExpression, ApiTypeLiteralDto> {
    private location: ApiItemLocationDto;
    private members: ApiItemReference[] = [];

    protected ResolveApiKind(): ApiItemKind.TypeLiteral | ApiItemKind.ObjectLiteral {
        if (ts.isTypeLiteralNode(this.Declaration)) {
            return ApiItemKind.TypeLiteral;
        } else {
            return ApiItemKind.ObjectLiteral;
        }
    }

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        if (ts.isTypeLiteralNode(this.Declaration)) {
            this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);
        } else if (ts.isObjectLiteralExpression(this.Declaration)) {
            this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.properties, this.Options);
        }
    }

    public OnExtract(): ApiTypeLiteralDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const apiKind = this.ResolveApiKind();

        return {
            ApiKind: apiKind,
            ParentId: parentId,
            Name: this.Symbol.name,
            Metadata: metadata,
            Location: this.location,
            Members: this.members,
            _ts: this.GetTsDebugInfo()
        };
    }
}
