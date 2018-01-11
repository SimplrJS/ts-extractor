import { ApiCallDto } from "./definitions/api-call-dto";
import { ApiClassConstructorDto } from "./definitions/api-class-constructor-dto";
import { ApiClassDto } from "./definitions/api-class-dto";
import { ApiClassMethodDto } from "./definitions/api-class-method-dto";
import { ApiClassPropertyDto } from "./definitions/api-class-property-dto";
import { ApiConstructDto } from "./definitions/api-construct-dto";
import { ApiEnumDto } from "./definitions/api-enum-dto";
import { ApiEnumMemberDto } from "./definitions/api-enum-member-dto";
import { ApiExportDto } from "./definitions/api-export-dto";
import { ApiExportSpecifierDto } from "./definitions/api-export-specifier-dto";
import { ApiImportSpecifierDto } from "./definitions/api-import-specifier-dto";
import { ApiFunctionDto } from "./definitions/api-function-dto";
import { ApiFunctionTypeDto } from "./definitions/api-function-type-dto";
import { ApiIndexDto } from "./definitions/api-index-dto";
import { ApiInterfaceDto } from "./definitions/api-interface-dto";
import { ApiMethodDto } from "./definitions/api-method-dto";
import { ApiNamespaceDto } from "./definitions/api-namespace-dto";
import { ApiParameterDto } from "./definitions/api-parameter-dto";
import { ApiPropertyDto } from "./definitions/api-property-dto";
import { ApiSourceFileDto } from "./definitions/api-source-file-dto";
import { ApiTypeAliasDto } from "./definitions/api-type-dto";
import { ApiTypeLiteralDto } from "./definitions/api-type-literal-dto";
import { ApiTypeParameterDto } from "./definitions/api-type-parameter-dto";
import { ApiVariableDto } from "./definitions/api-variable-dto";
import { ApiGetAccessorDto } from "./definitions/api-get-accessor-dto";
import { ApiSetAccessorDto } from "./definitions/api-set-accessor-dto";

export type ApiItemDto = ApiCallDto |
    ApiClassConstructorDto |
    ApiClassDto |
    ApiClassMethodDto |
    ApiClassPropertyDto |
    ApiConstructDto |
    ApiEnumDto |
    ApiEnumMemberDto |
    ApiExportDto |
    ApiExportSpecifierDto |
    ApiImportSpecifierDto |
    ApiFunctionDto |
    ApiFunctionTypeDto |
    ApiIndexDto |
    ApiInterfaceDto |
    ApiMethodDto |
    ApiNamespaceDto |
    ApiParameterDto |
    ApiPropertyDto |
    ApiSourceFileDto |
    ApiTypeAliasDto |
    ApiTypeLiteralDto |
    ApiTypeParameterDto |
    ApiVariableDto |
    ApiGetAccessorDto |
    ApiSetAccessorDto;
