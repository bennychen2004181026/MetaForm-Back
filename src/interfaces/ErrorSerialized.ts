export default interface ErrorSerialized {
    message: string;
    field?: string;
    detail?: string;
    statusCode?: number;
}