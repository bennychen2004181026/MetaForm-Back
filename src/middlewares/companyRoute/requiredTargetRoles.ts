import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from '@models/user.model';
import Errors from '@errors/ClassError';
import { IUser } from '@interfaces/users';
import { Role } from '@interfaces/userEnum';

const requiredTargetRoles =
    (requiredTargetRoles: Role[]): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const { userId } = req.params;
        const rolesList = requiredTargetRoles.join(', ');
        try {
            const targetUser: IUser | null = await User.findById(userId).exec();

            if (!targetUser) {
                throw new Errors.DatabaseError('Target user not found', 'Target user');
            }
            const targetUserRole = targetUser.role as Role;

            if (!targetUserRole || !requiredTargetRoles.includes(targetUserRole)) {
                throw new Errors.ValidationError(
                    `Invalid Authorization, required target roles: ${rolesList}`,
                    ` ${rolesList}`,
                );
            }

            res.locals.targetUser = targetUser;
            next();
        } catch (error: unknown) {
            next(error);
        }
    };

export default requiredTargetRoles;
