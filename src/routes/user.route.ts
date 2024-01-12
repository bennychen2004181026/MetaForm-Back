import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import routeValidators from '@middleware/routeValidators/users';
import userRouteMiddlewares from '@middleware/usersRoute';

import userControllers from '@controllers/user.controller';
import middlewares from '@middleware/index';
import { IUser } from '@interfaces/users';
import { ICompany } from '@interfaces/company';

const userRouter = express.Router();

userRouter.post(
    '/verify-email',
    middlewares.alreadyLogin,
    routeValidators.emailValidator,
    routeValidators.checkUserExistence,
    userControllers.sendVerificationEmail,
);

userRouter.get(
    '/verification/:token',
    middlewares.alreadyLogin,
    userRouteMiddlewares.verifyToken,
    userControllers.prepareAccountCreation,
);

userRouter.post(
    '/create-account',
    middlewares.alreadyLogin,
    routeValidators.userInfosValidator,
    userControllers.createAccount,
    userRouteMiddlewares.generateToken,
    userRouteMiddlewares.sendTokenAndUser,
);

userRouter.post(
    '/:userId/completeAccount',
    userRouteMiddlewares.verifyUserId,
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.completeAccountValidator,
    userRouteMiddlewares.checkAccountCompletion,
    userControllers.completeAccount,
);

userRouter.post(
    '/login',
    middlewares.alreadyLogin,
    routeValidators.loginValidator,
    userControllers.login,
);

userRouter.post(
    '/forgotPassword',
    middlewares.alreadyLogin,
    routeValidators.forgotPasswordValidator,
    userControllers.forgotPassword,
);

userRouter.post(
    '/resetPassword',
    routeValidators.resetPasswordValidator,
    userControllers.resetPassword,
);

userRouter.get(
    '/auth/google',
    (req: Request, res: Response, next: NextFunction) => {
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

userRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/users/login' }),
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            const user = req.user as IUser;
            res.locals.user = user;
            res.locals.userId = user._id;
            res.locals.isAccountComplete = user.isAccountComplete;
            res.locals.companyInfo = user.company as ICompany;
            next();
        } catch (error) {
            next(error);
        }
    },
    userRouteMiddlewares.generateToken,
    userRouteMiddlewares.sendOauthScript,
    middlewares.googleOauthErrorHandler,
);

userRouter.get(
    '/getPresignedUrl',
    userRouteMiddlewares.verifyHeaderToken,
    userControllers.getPresignedUrl,
);

userRouter.get('/getCloudFrontPresignedUrl', userControllers.getCloudFrontPresignedUrl);

userRouter.post(
    '/:userId/change-password',
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.changePasswordValidator,
    userControllers.changePassword,
);

export default userRouter;
