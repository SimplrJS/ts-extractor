// Simple class with overload constructor

export class FooClass {
    /**
     * Creating foo with text.
     * @param text Text for the foo class.
     */
    constructor(text: string)
    /**
     * Creating foo with boolean.
     * @param should Boolean for foo class.
     */
    constructor(should: boolean)
    // tslint:disable-next-line:no-empty
    constructor(arg: string | boolean) { }
}
