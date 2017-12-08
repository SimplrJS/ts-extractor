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
    protected SetFoo?(foo?: string): void;

    /**
     * GetFoo overload comment.
     * @param text GetFoo property comment.
     */
    public GetFoo(text: string): string;
    /**
     * GetFoo overload comment.
     * @param open GetFoo property comment.
     */
    public GetFoo(open: boolean): string;
    /**
     * GetFoo without A parameter comment line.
     */
    public GetFoo(arg: string | boolean): string {
        return "";
    }

    public async AsyncGetFoo?(): Promise<string>;

    /**
     * Property Id comment line.
     * @readonly Id is Immutable.
     */
    public readonly IdProperty: string;
    public static BarProperty: string;
}
