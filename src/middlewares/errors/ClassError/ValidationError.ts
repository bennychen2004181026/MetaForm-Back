import CustomError from "./CustomError";

export default class ValidationError extends CustomError {
    statusCode: number = 400;

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}