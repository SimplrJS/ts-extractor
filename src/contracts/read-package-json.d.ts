declare module 'read-package-json' {
    function readPackageJson<TData>(packageJsonPath: string, errorReporter: Function, strict: boolean, callback: (err: Error, data: TData) => void): void;
    namespace readPackageJson {
        // TODO: Rest of the API
    }
    export = readPackageJson;
}
