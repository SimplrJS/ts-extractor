import * as readJson from "read-package-json";
import { PackageJson } from "read-package-json";

export async function readPackageJson(
    packageJsonPath: string,
    errorReporter: (...messages: string[]) => void,
    strict: boolean = false
): Promise<PackageJson> {
    return new Promise<PackageJson>((resolve, reject) => {
        readJson(packageJsonPath, errorReporter, strict, (err: Error, data: PackageJson) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}
