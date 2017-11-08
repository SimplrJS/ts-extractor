// Extends another class with generic and implements interface.

export abstract class FooBase<TValue> {
    public abstract GetValue(): TValue;
}

export interface Bar {
    BarName: string;
}

export class Foo extends FooBase<number> implements Bar {
    public GetValue(): number {
        return 0;
    }

    public BarName: string;
}
