// Implemented 2 interfaces in class.

export interface Foo {
    Bar: string;
}

export interface Foo2 {
    Bar2: string;
}

export class FooClass implements Foo, Foo2 {
    public Bar: string;
    public Bar2: string;
}
