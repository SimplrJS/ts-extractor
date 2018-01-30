// Interface with TypeParameters and Method with TypeParameters with the same generic type name.

export interface Foo<TValue> {
    Bar<TValue>(args: string): void;
}
