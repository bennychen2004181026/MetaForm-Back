import { Response, Request } from 'express';
import CustomError from '@errors/ClassError/CustomError';

const googleOauthErrorHandler = (err: Error, req: Request, res: Response): Response | void => {
    const { NODE_ENV, APP_URL_LOCAL, APP_URL_TEST, APP_URL_PRODUCTION } = process.env;

    const appURLs: {
        [key: string]: string | undefined;
        development: string | undefined;
        test: string | undefined;
        production: string | undefined;
    } = {
        development: APP_URL_LOCAL,
        test: APP_URL_TEST,
        production: APP_URL_PRODUCTION,
    };

    const APP_URL_ORIGIN = `${appURLs[NODE_ENV ?? 'development']}`;

    if (err instanceof CustomError) {
        const script = `
        window.opener.postMessage({
            error: ${JSON.stringify(err.serializeErrors())}
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
        error: [
            {
                name: err.name,
                message: err.message,
                statusCode,
            },
        ],
    };
    const script = `
    window.opener.postMessage(${errorResponse}
    , '${APP_URL_ORIGIN}');
    window.close();
`;
    return res.status(statusCode).send(`<script>${script}</script>`);
};

export default googleOauthErrorHandler;
