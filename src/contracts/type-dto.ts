import * as ts from "typescript";

import { ApiItemTypes } from "./api-item-types";
import { TypeKinds } from "./type-kinds";

export interface ApiTypeDto {
    Kind: TypeKinds;
    Generics?: ApiTypeDto[];
    Types?: ApiTypeDto[];
    Reference?: string;
    Flags: ts.TypeFlags;
    FlagsString: string;
    Text: string;
    Name?: string;
}
