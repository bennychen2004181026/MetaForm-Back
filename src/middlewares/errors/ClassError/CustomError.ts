import ErrorSerialized from 'src/interfaces/ErrorSerialized'

export default abstract class CustomError extends Error {
    abstract statusCode: number

    private originalErrorMessage?: string;

    constructor(message: string, public field?: string, error?: Error) {
        super(message)
        if (field) {
            this.field = field
        }
        this.originalErrorMessage = error?.message;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    serializeErrors(): ErrorSerialized[] {
        const serialized: ErrorSerialized = {
            message: this.message,
            statusCode: this.statusCode
        };

        if (this.field) {
            serialized.field = this.field;
        }
        if (this.originalErrorMessage) {
            serialized.detail = this.originalErrorMessage;
        }
        return [serialized];
    }
}