// Implemented 2 interfaces in class.

interface Foo {
    Bar: string;
}

interface Foo2 {
    Bar2: string;
}

export class FooClass implements Foo, Foo2 {
    public Bar: string;
    public Bar2: string;
}
