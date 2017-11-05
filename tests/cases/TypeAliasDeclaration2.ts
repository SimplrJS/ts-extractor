// tslint:disable:no-consecutive-blank-lines
// Simple type declarations with type parameters

export type MyType<TType> = {
    BarName: string;
    FooName: TType;
};

export type AnotherType = MyType<number>;


export type NoCommonFields1 = {
    FooName: string;
};

export type NoCommonFields2 = {
    BarName: number;
};

export type NoCommonFieldsType = NoCommonFields1 | NoCommonFields2;


// Two types have a one common field
export type OneCommonField1 = {
    BarName: string;
    FooName: string;
};

export type OneCommonField2 = {
    BarName: string;
    BazName: string;
};

export type OneCommonFieldTypeIntersection = OneCommonField1 | OneCommonField2;

