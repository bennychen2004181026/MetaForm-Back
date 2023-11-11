import express from 'express';
import routeValidators from '@middleware/routeValidators/users';
import userControllers from '@controllers/user.controller';

const userRouter = express.Router();
userRouter.post('/verify-email',
    routeValidators.emailValidator,
    routeValidators.checkUserExistence,
    userControllers.sendVerificationEmail
);

export default userRouter;