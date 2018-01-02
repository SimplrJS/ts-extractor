export class Foo {
    public get foo(): string {
        return "";
    }

    public set foo(arg: string) {
        console.info(arg);
    }
}
