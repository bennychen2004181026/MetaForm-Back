import CustomError from "./CustomError";

export default class AuthorizationError extends CustomError {
    statusCode: number = 401; // Unauthorized

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}