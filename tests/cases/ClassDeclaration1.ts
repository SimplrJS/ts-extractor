// Simple class.

/**
 * Class Foo comment line.
 * @summary Summary of comment line.
 */
export class FooClass {
    /**
     * Sets foo.
     * @param foo foo
     */
    protected SetFoo(foo?: string): void { }

    /**
     * GetFoo overload comment.
     * @param a GetFoo property comment.
     */
    public GetFoo(a?: string): string;
    /**
     * GetFoo without A parameter comment line.
     */
    public GetFoo(): string {
        return "";
    }

    /**
     * Property Id comment line.
     * @readonly Id is Immutable.
     */
    public readonly IdProperty: string;
    public static BarProperty: string;
}
