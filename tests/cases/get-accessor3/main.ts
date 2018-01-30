export abstract class Foo {
    public abstract get Foo(): string;

    public static get StaticFoo(): string {
        return "";
    }

    private get foo(): string {
        return "";
    }

    protected get ProtectedFoo(): string {
        return "";
    }
}
