import express from 'express';
import routeValidators from '@middleware/routeValidators/users';
import userRouteMiddlewares from '@middleware/usersRoute'
import userControllers from '@controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/verify-email',
    routeValidators.emailValidator,
    routeValidators.checkUserExistence,
    userControllers.sendVerificationEmail
);

userRouter.get('/verify-token/:token',
    userRouteMiddlewares.verifyToken,
    userControllers.prepareAccountCreation
)

export default userRouter;