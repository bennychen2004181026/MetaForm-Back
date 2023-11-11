import CustomError from "./CustomError";

export default class EnvironmentError extends CustomError {
    statusCode: number = 500;

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, EnvironmentError.prototype);
    }
}