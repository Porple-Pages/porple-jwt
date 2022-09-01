export declare class Exception {
    message: string;
    code: number;
    constructor(message: string, code: number);
    static fromValidation(validation: any): {
        message: string;
        errors: any;
    };
    static fromErrorMessage(message: string, code?: number): {
        message: string;
        code: number;
    };
}
