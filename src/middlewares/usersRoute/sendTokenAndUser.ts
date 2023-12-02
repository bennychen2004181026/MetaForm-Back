import { Request, Response, NextFunction } from 'express';
import Errors from '@errors/ClassError';

const sendTokenAndUser = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { token, user } = res.locals;

  if (!token) {
    return next(new Errors.AuthorizationError('Token not found'));
  }

  if (!user || !user._id) {
    return next(new Errors.BusinessLogicError("User information not found", 'userId'));
  }

  return res
    .set('Authorization', `Bearer ${token}`)
    .status(201)
    .json({
      message: 'User created, please complete your account setup',
      token,
      user,
    });
};

export default sendTokenAndUser 