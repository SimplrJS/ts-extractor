export interface Foo {
    Name: string;
    LastName: string;
}

export type Bar = {
    [TKey in keyof Foo]: Foo[TKey]
};
