export abstract class Foo {
    public abstract set Foo(arg: string);
    public static set StaticFoo(arg: string) { }
    private set foo(arg: string) { }
    protected set ProtectedFoo(arg: string) { }
}
