import { AstItemBaseDto } from "./ast-item";

export interface ExtractorDto {
    name: string;
    version: string;
    registry: ExtractorRegistryDto;
}

export interface ExtractorRegistryDto {
    [key: string]: AstItemBaseDto;
}
