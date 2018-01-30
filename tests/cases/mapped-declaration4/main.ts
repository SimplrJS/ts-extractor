export interface Foo {
    Name: string;
    Age: number;
}

export type mapped = {
    [K in keyof Foo]?: number
};
