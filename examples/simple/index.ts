export * from "./exported-functions";
// export type A<TValue> = number & { ok(): TValue };

// /**
//  * Some JSdoc information.
//  * 2nd line of some JSdoc information.
//  * @summary Some summary about this package version.
//  * @summary 2nd of some summary about this package version.
//  */
// export const itemsList: Array<string | A<number>> = ["a"];

// export function Ok(isIt: boolean): boolean {
//     return isIt;
// }

// export function OkWithoutReturnType(isIt: boolean) {
//     return isIt;
// }

// export namespace SomeKindOfModule {
//     export const name = "some-kind-of-module";
// }

// export enum Uogos {
//     Jokie = "jokie",
//     Braskes = "braskes"
// }

// export enum Skaiciai {
//     Nulis = 0,
//     Vienas = 1,
//     Du = 2
// }

// export enum Sarasas {
//     Pirmas,
//     Antras,
//     Trecias
// }

// export interface Boo {
//     Boos: string[];
// }

// export interface Foo<TType> {
//     Name: string;
//     Surname: string;
//     Type: TType;
// }

// export interface Bar extends Foo<number>, Boo {
//     OtherStuff: string[];
// }

export interface A {
    (aa: boolean): string;
}

// export abstract class Foo {
//     public Name: string;

//     private somePrivateProperty: any;

//     public GetName(ok: string): string;
//     public GetName(ok: string, ok2?: string): string {
//         return this.Name;
//     }

//     public abstract Bar(): string;
// }
