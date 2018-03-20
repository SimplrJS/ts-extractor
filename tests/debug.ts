import * as path from "path";
import { GetCompilerOptions } from "../src/utils/tsconfig-json";

import { TsExtractor } from "../src/extractor";

export async function main(): Promise<void> {
    const projectDirectory = path.resolve(__dirname, "./examples/simple/");
    const tsconfigPath = path.join(projectDirectory, "tsconfig.json");
    const compilerOptions = await GetCompilerOptions(tsconfigPath);

    const extractor = new TsExtractor({
        compilerOptions: compilerOptions,
        projectDirectory: projectDirectory
    });
    debugger;

    extractor.extract([path.resolve("examples/simple/index.ts")]);
}

main();

// import * as path from "path";
// import { GetCompilerOptions } from "./utils/tsconfig-json";
// import * as fs from "fs-extra";

// import { Extractor } from "./extractor";
// import { ApiHelpers } from "./api-helpers";
// import { AccessModifier } from "./contracts";

// async function main(): Promise<void> {
//     const projectDirectory = path.resolve(__dirname, "./examples/simple/");
//     const tsconfigPath = path.join(projectDirectory, "tsconfig.json");
//     const compilerOptions = await GetCompilerOptions(tsconfigPath);

//     const extractor = new Extractor({
//         CompilerOptions: compilerOptions,
//         ProjectDirectory: projectDirectory,
//         ExternalPackages: ["typescript"],
//         FilterApiItems: apiItem => {
//             const accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(apiItem.Declaration.modifiers);
//             if (accessModifier === AccessModifier.Private) {
//                 return false;
//             }

//             const metadata = apiItem.GetItemMetadata();
//             if (metadata.JSDocTags.findIndex(x => x.name === "private") !== -1) {
//                 return false;
//             }

//             return true;
//         }
//     });

//     const extract1 = extractor.Extract([path.resolve("examples/simple/index.ts")]);
//     // tslint:disable-next-line:no-console
//     console.log(JSON.stringify(extract1, null, 4));

//     await fs.writeJson("./debug.json", extract1);
// }

// main();
