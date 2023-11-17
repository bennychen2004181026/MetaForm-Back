import { Request, Response, NextFunction } from 'express';
import User from '@models/user.model';
import Errors from '@errors/ClassError'

const checkUserExistence = async (req: Request, res: Response, next: NextFunction):Promise<Response | void> => {
  try {
    const { email, username } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return next(new Errors.AuthorizationError('Email or username is already in use.', 'Email or username'))
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkUserExistence;