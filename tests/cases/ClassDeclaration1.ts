// Simple class.

export class Foo {
    protected SetFoo(foo: string): void { }

    public GetFoo(a?: string): string;
    public GetFoo(): string {
        return "";
    }

    public readonly Id: string;
    public static Bar: string;
}
