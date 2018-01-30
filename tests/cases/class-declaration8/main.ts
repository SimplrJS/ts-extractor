export class Control {
    private state: any;
}

export interface SelectableControl extends Control {
    select(): void;
}

export class Button extends Control implements SelectableControl {
    select() { }
}
