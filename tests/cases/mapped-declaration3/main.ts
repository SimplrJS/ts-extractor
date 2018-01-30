export interface Foo {
    Name: string;
    Age: number;
}

export type mapped = {
    readonly [K in keyof Foo]: number
};
