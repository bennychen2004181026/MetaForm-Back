import CustomError from './CustomError';

export default class FileUploadError extends CustomError {
    statusCode = 400; // Bad Request

    constructor(message: string, field?: string, error?: Error) {
        super(message, field, error);
        Object.setPrototypeOf(this, FileUploadError.prototype);
    }
}

