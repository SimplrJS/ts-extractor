export interface A {
    b: string;
}

export const a: A = {
    b: "str"
};

export const z: typeof a = {
    b: "bstr"
};
