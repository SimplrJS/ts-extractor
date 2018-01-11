export interface Foo<TValue> {
    Name: TValue;
}

export class Bar { }

// tslint:disable-next-line:typedef
export function Result(arg: any) {
    return arg as string | number;
}
