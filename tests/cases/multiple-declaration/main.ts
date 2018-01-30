export namespace M {
    class C { }
    interface C { }
    interface D { }
    class D { }
}

export interface Foo<T> {
    a: string;
}

export class Foo<T> {
    public b: number;
}

export class Bar<T> {
    public b: number;
}

export interface Bar<T> {
    a: string;
}
