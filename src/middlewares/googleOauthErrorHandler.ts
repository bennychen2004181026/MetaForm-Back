import { Request, Response, NextFunction } from 'express';
import CustomError from '@errors/ClassError/CustomError';
import { currentAppUrl } from '@utils/urlsExport';

const googleOauthErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): Response | void => {
    const APP_URL_ORIGIN = `${currentAppUrl}`;

    if (err instanceof CustomError) {
        const script = `
        window.opener.postMessage({
            source: 'GoogleOAuth',
            errors: ${JSON.stringify(err.serializeErrors())}
        }, '${APP_URL_ORIGIN}');
        window.close();
    `;
        return res.status(err.statusCode).send(`<script>${script}</script>`);
    }

    const fallbackStatusCode = 500;

    const statusCode =
        typeof (err as { statusCode?: number }).statusCode === 'number'
            ? (err as unknown as { statusCode: number }).statusCode
            : fallbackStatusCode;

    const errorResponse = {
        source: 'GoogleOAuth',
        errors: [
            {
                name: err.name,
                message: err.message,
                statusCode,
            },
        ],
    };
    const script = `
    window.opener.postMessage((${JSON.stringify(errorResponse)}
    , '${APP_URL_ORIGIN}');
    window.close();
`;
    return res.status(statusCode).send(`<script>${script}</script>`);
};

export default googleOauthErrorHandler;
