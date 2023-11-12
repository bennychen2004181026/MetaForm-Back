import express from 'express';
import routeValidators from '@middleware/routeValidators/users';
import userRouteMiddlewares from '@middleware/usersRoute'
import userControllers from '@controllers/user.controller';
import middlewares from '@middleware/index';

const userRouter = express.Router();

userRouter.post('/verify-email',
    middlewares.alreadyLogin,
    routeValidators.emailValidator,
    routeValidators.checkUserExistence,
    userControllers.sendVerificationEmail
);

userRouter.get('/verify-token/:token',
    userRouteMiddlewares.verifyToken,
    userControllers.prepareAccountCreation
)

userRouter.post('/create-account',
    middlewares.alreadyLogin,
    routeValidators.userInfosValidator,
    userControllers.createAccount,
    userRouteMiddlewares.generateToken,
    userRouteMiddlewares.sendTokenAndUser
)

userRouter.post('/:userId/completeAccount',
    userRouteMiddlewares.verifyUserId,
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.completeAccountValidator,
    userRouteMiddlewares.checkAccountCompletion,
    userControllers.completeAccount
);

userRouter.post('/login',
    middlewares.alreadyLogin,
    routeValidators.loginValidator,
    userControllers.login
)

export default userRouter;