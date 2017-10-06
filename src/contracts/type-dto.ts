import * as ts from "typescript";

import { ApiItemKinds } from "./api-item-kinds";
import { TypeKinds } from "./type-kinds";

export interface ApiTypeDto {
    ApyTypeKind: TypeKinds;
    Generics?: ApiTypeDto[];
    Types?: ApiTypeDto[];
    Reference?: string;
    Flags: ts.TypeFlags;
    FlagsString: string;
    Text: string;
    Name?: string;
}
