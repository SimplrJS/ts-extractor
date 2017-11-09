// Extending another class with generic.

export abstract class FooBase<TValue> {
    public abstract GetValue(): TValue;
}

export class Foo extends FooBase<number> {
    public GetValue(): number {
        return 0;
    }
}
