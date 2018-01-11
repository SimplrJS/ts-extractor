// import * as ts from "typescript";

// export enum ApiItemKindsAdditional {
//     ___Any = "any",
//     ___Any2 = "any2"
// }

export interface Foo {
    Name: string;
    Surname: string;
}

// export interface Bar {
//     Number: number;
// }

// // export var x: this is string;

// export type SyntaxKinds___<TValue> = TValue;

// export class Foo {
//     public Bar(arg: any): arg is string {
//         return true;
//     }
// }

export type TYPE__ = {
    [T in keyof Foo]: Foo[T]
};
