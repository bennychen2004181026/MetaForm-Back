import CustomError from './CustomError';

export default class CastError extends CustomError {
    statusCode: number = 400;

    // 'public' indicates that a property or method can be accessed from outside the class
    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, CastError.prototype);
    }
}
