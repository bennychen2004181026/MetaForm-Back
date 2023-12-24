import { Request, Response, NextFunction, RequestHandler } from 'express';
import Errors from '@errors/ClassError';
import Company from '@models/company.model';
import User from '@models/user.model';
import { ICompany } from '@interfaces/company';
import { IUser } from '@interfaces/users';

const validateCompanyAndUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { userId, role } = res.locals;
    const { companyId } = req.params;

    if (!userId || userId.trim().length === 0) {
        throw new Errors.NotFoundError('User not found', 'userId');
    }

    if (!role || role.trim().length === 0) {
        throw new Errors.NotFoundError(`User'role is missing`, 'Role');
    }

    try {
        const user: IUser | null = await User.findById(userId).exec();

        if (!user) {
            throw new Errors.NotFoundError(
                'User not found in the database',
                'user not found in database',
            );
        }

        const existedCompany: ICompany | null = await Company.findById(companyId).exec();

        if (!existedCompany || !existedCompany.employees) {
            throw new Errors.ValidationError('Invalid companyId', 'companyId');
        }

        if (!user.company || user.company.toString() !== existedCompany._id.toString()) {
            throw new Errors.ValidationError(
                'Company and employee does not match',
                'company and employee',
            );
        }

        res.locals.userId = userId as string;
        res.locals.role = role as string;
        next();
    } catch (error) {
        next(error);
    }
};

export default validateCompanyAndUser;
