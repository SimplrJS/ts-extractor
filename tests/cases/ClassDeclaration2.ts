// Abstract class.

export abstract class Foo {
    protected abstract SetFoo(foo: string): void;

    public GetFoo(): string {
        return "";
    }

    public abstract readonly Id: string;
    public static Bar: string;
}
