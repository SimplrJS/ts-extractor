export interface Face {
    foo(): void;
}

export class Camera implements Face {
    constructor(public str: string) { }

    public foo(): string { return "s"; }
}
