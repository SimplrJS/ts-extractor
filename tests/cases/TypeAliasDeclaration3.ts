// tslint:disable:no-consecutive-blank-lines
// Simple type declarations with type parameters

export type NoCommonFields1<TType> = {
    BarName: string;
    FooName: TType;
};

export type NoCommonFields2<TType> = {
    BazName: TType;
};

export type AnotherType = NoCommonFields1<number> | NoCommonFields2<string>;



// Two types have a one common field
export type OneCommonField1<TType> = {
    BarName: TType;
    FooName: string;
};

export type OneCommonField2<TType> = {
    BarName: TType;
    BazName: string;
};

export type OneCommonFieldTypeIntersection = OneCommonField1<number> | OneCommonField2<number>;

export type OneCommonFieldTypeIntersectionWithDifferentTypes = OneCommonField1<number> & OneCommonField2<string>;
