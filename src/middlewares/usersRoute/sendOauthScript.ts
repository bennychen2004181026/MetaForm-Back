import { Request, Response, NextFunction, RequestHandler } from 'express';
import { isBoolean } from 'lodash';
import Errors from '@errors/ClassError';
import { currentAppUrl } from '@utils/urlsExport';

const sendOauthScript: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void | Response => {
    try {
        const { token, user, isAccountComplete, companyInfo } = res.locals;
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

        const APP_URL_ORIGIN = `${currentAppUrl}`;
        if (isAccountComplete && companyInfo) {
            const script = `
            window.opener.postMessage({
                source: 'GoogleOAuth',
                message: 'Google Oauth user successfully login.',
                token: '${token}',
                user: ${JSON.stringify(user)},
                companyInfo: ${companyInfo},
                isAccountComplete: ${isAccountComplete}
            }, '${APP_URL_ORIGIN}');
            window.close();
        `;
            return res.status(201).send(`<script>${script}</script>`);
        }

        const script = `
        window.opener.postMessage({
            source: 'GoogleOAuth',
            message: 'Google Oauth user successfully created, please complete the company binding.',
            token: '${token}',
            user: ${JSON.stringify(user)},
            isAccountComplete: ${false}
        }, '${APP_URL_ORIGIN}');
        window.close();
        `;
        return res.status(201).send(`<script>${script}</script>`);
    } catch (error) {
        next(error);
    }
};

export default sendOauthScript;
