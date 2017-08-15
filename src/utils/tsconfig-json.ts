import * as fs from "mz/fs";
import * as path from "path";
import * as ts from "typescript";

// TODO: Fool proof.
export async function GetCompilerOptions(fileLocation: string): Promise<ts.CompilerOptions> {
    const rawContent = await fs.readFile(fileLocation, "utf-8");
    const json = JSON.parse(rawContent);

    const fullPath = path.resolve(fileLocation);
    const dirName = path.dirname(fullPath);

    const compilerOptions = ts.convertCompilerOptionsFromJson(json.compilerOptions, dirName);

    compilerOptions.options.typeRoots = ["."];

    return compilerOptions.options;
}
