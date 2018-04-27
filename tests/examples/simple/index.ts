// export function pickCard(x: { suit: string; card: number }[]): number;
// export function pickCard(x: number): { suit: string; card: number };
// export function pickCard(x: any): number | { suit: string; card: number } | undefined {
//     const suits = ["hearts", "spades", "clubs", "diamonds"];
//     // Check to see if we're working with an object/array
//     // if so, they gave us the deck and we'll pick the card
//     if (typeof x == "object") {
//         let pickedCard = Math.floor(Math.random() * x.length);
//         return pickedCard;
//     } else if (typeof x == "number") {
//         // Otherwise just let them pick the card
//         let pickedSuit = Math.floor(x / 13);
//         return { suit: suits[pickedSuit], card: x % 13 };
//     }
// }

// export interface MyStuff {
//     length: number;
// }

// import { MyInterface } from "./my-types";

// export namespace CardHelpers {
//     export function pickCard(p1: string): MyInterface;
//     export function pickCard(p1: MyStuff): string;
//     export function pickCard(p1: string | MyStuff): MyInterface | string {
//         return "card";
//     }
// }

export class Bar {}

export class Foo extends Bar {
    public bar(): string {
        return "";
    }

    public static bar(): string {
        return "";
    }
}

// export function foo<p1>(p1: p1): p1 {
// 	return p1;
// }
