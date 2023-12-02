import { Request, Response, NextFunction } from 'express';
import Company from '@models/company.model';
import User from '@models/user.model';
import Errors from '@errors/ClassError';

const checkAccountCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { userId } = res.locals;

    if (!userId || userId.trim().length === 0) {
        return next(new Errors.AuthorizationError('UserId must be provided', 'Authorization'));
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(new Errors.NotFoundError('User not found in the database', 'user'));
        }

        // Scenario 1: User who has labeled as account not completed but with company attached is trying to access '/completeAccountWithCom
        if (!user.isAccountComplete && user.company) {
            const companyExists = await Company.exists({ _id: user.company }).exec();

            if (!companyExists) {
                await User.updateOne({ _id: user._id }, { $unset: { company: '' } }).exec();
                return next(
                    new Errors.BusinessLogicError(
                        'Company not found, please complete the company binding',
                        'company binding',
                    ),
                );
            }
            await User.updateOne({ _id: user._id }, { isAccountComplete: true });
            return next(new Errors.BusinessLogicError('User has company attached already', 'user'));
        }

        // Scenario 2: User who has already label account completed without the company attached is trying to access '/completeAccountWithCom
        if (user.isAccountComplete && !user.company) {
            await User.updateOne({ _id: user._id }, { isAccountComplete: false });
            return next();
        }

        // Scenario 3: User who has already label account completed with the company attached is trying to access '/completeAccountWithCom
        if (user.isAccountComplete && user.company) {
            const companyExists = await Company.exists({ _id: user.company }).exec();
            if (!companyExists) {
                await User.updateOne(
                    { _id: user._id },
                    {
                        $set: { isAccountComplete: false },
                        $unset: { company: '' },
                    },
                ).exec();
                return next(
                    new Errors.NotFoundError(
                        'Company not found, please complete the company binding',
                        'company binding',
                    ),
                );
            }
            return next(new Errors.BusinessLogicError('User has company attached already', 'user'));
        }

        // Scenario 4: Newly created user
        if (!user.isAccountComplete) {
            return next();
        }

        next();
    } catch (error: unknown) {
        return next(error);
    }
};

export default checkAccountCompletion;
