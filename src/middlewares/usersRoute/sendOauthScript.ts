import { Request, Response, NextFunction, RequestHandler } from 'express';
import { isBoolean } from 'lodash';
import Errors from '@errors/ClassError';

const sendOauthScript: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void | Response => {
    try {
        const { token, user, isAccountComplete } = res.locals;
        const { NODE_ENV, APP_URL_LOCAL, APP_URL_TEST, APP_URL_PRODUCTION } = process.env;

        if (!NODE_ENV || !APP_URL_LOCAL || !APP_URL_TEST || !APP_URL_PRODUCTION) {
            throw new Errors.EnvironmentError('Missing environment variables', 'env');
        }

        if (!token) {
            return next(new Errors.AuthorizationError('Token not found'));
        }

        if (!user || !user._id || !isBoolean(isAccountComplete)) {
            return next(new Errors.DatabaseError('User information not found', 'User'));
        }

        const appURLs: {
            [key: string]: string | undefined;
            development: string;
            test: string;
            production: string;
        } = {
            development: APP_URL_LOCAL,
            test: APP_URL_TEST,
            production: APP_URL_PRODUCTION,
        };

        const APP_URL_ORIGIN = `${appURLs[NODE_ENV]}`;
        if (isAccountComplete) {
            const script = `
        window.opener.postMessage({
            message:'Google Oauth user successfully login.',
            token: '${token}',
            user: ${JSON.stringify(user)},
            isAccountComplete:${isAccountComplete}
        }, ${APP_URL_ORIGIN});
        window.close();
        `;
            return res.status(201).send(`<script>${script}</script>`);
        }

        const script = `
        window.opener.postMessage({
            message:'Google Oauth user successfully created, please complete the company binding.',
            token: '${token}',
            user: ${JSON.stringify(user)},
            isAccountComplete:${isAccountComplete}
        }, ${APP_URL_ORIGIN});
        window.close();
        `;
        return res.status(201).send(`<script>${script}</script>`);
    } catch (error) {
        next(error);
    }
};

export default sendOauthScript;
