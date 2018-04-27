export interface ExtractorDto {
    name?: string;
    version?: string;
    registry: ExtractorRegistryDto;
    files: string[];
}

export interface ExtractorRegistryDto {
    [key: string]: {}; // TODO: FIX this.
}
