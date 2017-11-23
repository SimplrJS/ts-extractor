export interface Foo {
    // @ts-ignore
    [key: string, key2: string]: number;

    // @ts-ignore
    [a: number];
}
