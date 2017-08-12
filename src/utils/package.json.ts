import * as readPackageJson from "read-package-json";
import { PackageJson } from "../contracts/package.json";

export async function ReadPackageJson(
    packageJsonPath: string,
    errorReporter: Function = console.error,
    strict: boolean = false
): Promise<PackageJson> {
    return new Promise<PackageJson>((resolve, reject) => {
        readPackageJson(packageJsonPath, errorReporter, strict, (err: Error, data: PackageJson) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        })
    });
}
