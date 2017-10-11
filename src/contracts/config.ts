import * as fs from "fs-extra";
import * as path from "path";

export interface RawTsExtractorConfig extends Partial<TsExtractorConfig> {
    projectPath: string;
}

export interface TsExtractorConfig {
    projectPath: string;
    packageJsonPath: string;
    tsConfigPath: string;
}

export function ParseConfig(config: RawTsExtractorConfig): TsExtractorConfig {
    // defaults
    config.packageJsonPath = config.packageJsonPath || "./package.json";
    config.tsConfigPath = config.tsConfigPath || "./tsconfig.json";

    // Ensure absolute paths
    if (!path.isAbsolute(config.packageJsonPath)) {
        config.packageJsonPath = path.join(config.projectPath, config.packageJsonPath);
    }

    if (!path.isAbsolute(config.tsConfigPath)) {
        config.tsConfigPath = path.join(config.projectPath, config.tsConfigPath);
    }

    return {
        projectPath: config.projectPath,
        packageJsonPath: config.packageJsonPath,
        tsConfigPath: config.tsConfigPath
    };
}
