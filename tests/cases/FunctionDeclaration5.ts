export function IsString(arg: string | number): arg is string {
    return typeof arg === "string";
}
