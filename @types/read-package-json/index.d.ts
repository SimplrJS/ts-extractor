import { PackageJson as PackageJsonTypes } from "./package-json";

declare function readPackageJson<TData>(packageJsonPath: string, errorReporter: Function, strict: boolean, callback: (err: Error, data: TData) => void): void;
declare namespace readPackageJson {
    // TODO: Rest of the API
    export type PackageJson = PackageJsonTypes;
}
export = readPackageJson;
