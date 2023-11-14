import express,{ Request,Response,NextFunction } from 'express';
import passport from 'passport';
import routeValidators from '@middleware/routeValidators/users';
import userRouteMiddlewares from '@middleware/usersRoute'
import userControllers from '@controllers/user.controller';
import middlewares from '@middleware/index';
import logger from '@config/utils/winston';

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

userRouter.post('/forgotPassword',
    middlewares.alreadyLogin,
    routeValidators.forgotPasswordValidator,
    userControllers.forgotPassword
)

userRouter.post('/resetPassword',
    routeValidators.resetPasswordValidator,
    userControllers.resetPassword
)

userRouter.get('/auth/google',(req:Request, res:Response, next:NextFunction) => {
    logger.info("Initiating authentication with Google.");
    next();
  }, passport.authenticate('google', { scope: ['profile', 'email'] }))

  userRouter.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req:Request, res:Response, next:NextFunction) => {
    logger.info("Google authentication successful, user:", req.user);
    res.redirect('/dashboard');
  },
  (error: Error, req:Request, res:Response, next:NextFunction) => {
    logger.info("Error in Google authentication:", error);
    res.redirect('/users/login');
  }
);
export default userRouter;