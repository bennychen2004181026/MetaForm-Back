import { Request, Response, NextFunction, RequestHandler } from 'express';
import Errors from '@errors/ClassError';
import { Role } from '@interfaces/users';

const requiredRoles =
    (requiredRoles: Role[]): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const { role } = res.locals;
        const rolesList = requiredRoles.join(', ');
        if (!requiredRoles.includes(role)) {
            return next(
                new Errors.ValidationError(
                    `Invalid Authorization, required roles: ${rolesList}`,
                    ` ${rolesList}`,
                ),
            );
        }
        next();
    };

export default requiredRoles;
