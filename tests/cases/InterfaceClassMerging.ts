export interface Foo {
    method(a: number): string;
    optionalMethod?(a: number): string;
    property: string;
    optionalProperty?: string;
}

export class Foo {
    public additionalProperty: string;

    public additionalMethod(a: number): string {
        return this.method(0);
    }
}

export class Bar extends Foo {
    public method(a: number): string {
        return this.optionalProperty;
    }
}

export let bar = new Bar();
export let foo = new Foo();
export let iFoo: Foo;
