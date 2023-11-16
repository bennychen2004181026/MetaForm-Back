import CustomError from "./CustomError";

export default class NotFoundError extends CustomError {
    statusCode: number = 404 // Not Found

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}