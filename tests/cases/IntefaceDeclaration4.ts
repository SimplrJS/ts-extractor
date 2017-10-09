export interface a0 {
    (): string;
    (a, b, c?: string): number;

    new(): string;
    new(s: string);

    [n: number]: () => string;
    [s: string]: any;

    p1;
    p3?;
    p2: string;
    p4?: number;
    p5(s: number): string;

    f1();
    f2?();
    f3(a: string): number;
    f4?(s: number): string;
}

export interface a1 {
    [n: number]: number;
}

export interface a2 {
    [s: string]: number;
}

export interface a {
}

export interface b extends a {
}

export interface c extends a, b {
}

export interface d extends a {
}

export class c1 implements a {
}

export var instance2 = new c1();
