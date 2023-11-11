import CustomError from "./CustomError";

export default class DatabaseError extends CustomError {
    // The status code for database errors, typically a Server Error
    statusCode: number = 500;

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}