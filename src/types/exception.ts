export class Exception {
  message: string;
  code: number;
  constructor(message: string, code: number) {
    this.message = message;
    this.code = code;
  }
  static fromValidation(validation: any) {
    return { message: 'invalid data provided', errors: validation };
  }

  static fromErrorMessage(message: string, code = 100) {
    return { message, code };
  }
}
