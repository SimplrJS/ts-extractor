import { BaseApiItem } from "./api-item";

export interface ExtractorDto {
    name: string;
    version: string;
    registry: ExtractorRegistryDto;
}

export interface ExtractorRegistryDto {
    [key: string]: BaseApiItem;
}
