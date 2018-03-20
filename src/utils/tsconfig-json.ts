import * as fs from "fs-extra";
import * as path from "path";
import * as ts from "typescript";

// TODO: Fool proof.
/**
 * Get TypeScript compiler options from tsconfig.json.
 */
export async function GetCompilerOptions(fileLocation: string): Promise<ts.CompilerOptions> {
    const json = await fs.readJSON(fileLocation);

    const fullPath = path.resolve(fileLocation);
    const dirName = path.dirname(fullPath);

    const compilerOptions = ts.convertCompilerOptionsFromJson(json.compilerOptions, dirName);

    compilerOptions.options.typeRoots = ["."];

    return compilerOptions.options;
}
