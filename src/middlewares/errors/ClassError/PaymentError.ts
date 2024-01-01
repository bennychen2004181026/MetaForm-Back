import CustomError from './CustomError';

export default class PaymentError extends CustomError {
    statusCode: number = 402; // Payment Required

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, PaymentError.prototype);
    }
}
