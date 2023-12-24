import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Company from '@models/company.model';
import User from '@models/user.model';
import { ICompany } from '@interfaces/company';
import { IUser, Role } from '@interfaces/users';
import Errors from '@errors/ClassError';
import { sendEmail, emailTemplates } from '@utils/emailService';
import { validateToken } from '@utils/jwt';

/**
 * @swagger
 * /companies:
 *  post:
 *    tags: [Companies]
 *    summary: add a new company
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *              companyName: 'Company A'
 *              abn: '123456789'
 *              logo: 'http://companya.png'
 *              description: 'Company A description'
 *              industry:
 *                - manufacturing
 *                - diary
 *              address: '100 Elizabeth Street, 2000'
 *    responses:
 *      '201':
 *        description: Created
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: 61da409632c8196efc5dd779
 *              companyName: 'Company A'
 *              abn: '123456789'
 *              logo: 'http://companya.png'
 *              description: 'Company A description'
 *              industry:
 *                - manufacturing
 *                - diary
 *              isActive: true
 *              employees: []
 *              address: '100 Elizabeth Street, 2000'
 *              __v: 0
 *      '400':
 *        description: Duplicate key
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  exmaple: 'error message'
 */
const addCompany: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { companyName, abn, logo, description, industry, employees, address } = req.body;
        const companyByAbn = await Company.findOne({
            abn,
        });
        if (!companyByAbn) {
            const company: ICompany = await Company.create({
                companyName,
                abn,
                logo,
                description,
                industry,
                isActive: true,
                employees,
                address,
            });
            res.status(201).json(company);
        } else {
            res.status(400).json({ error: 'Company with this abn already exists' });
        }
    } catch (error) {
        res.status(400).json((error as Error).message);
    }
};

/**
 * @swagger
 * /companies:
 *  get:
 *    summary: return all companies, remove  notification, __version
 *    tags: [Companies]
 *    responses:
 *      200:
 *        description:  array of Company Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *            example:
 *              - _id: '61da409632c8196efc5dd779'
 *                companyName: 'Company A'
 *                abn: '123456789'
 *                logo: 'http://companya.png'
 *                description: 'Company A description'
 *                industry:
 *                  - manufacturing
 *                  - diary
 *                isActive: true
 *                employees: []
 *                address: '100 Elizabeth Street, 2000'
 *              - _id: '61da409632c8196efc5dd778'
 *                companyName: 'Company B'
 *                abn: '123456789'
 *                logo: 'http://companya.png'
 *                description: 'Company B description'
 *                industry:
 *                  - manufacturing
 *                  - diary
 *                isActive: true
 *                employees: []
 *                address: '100 Elizabeth Street, 2000'
 */

const getAllCompanies: RequestHandler = async (req: Request, res: Response) => {
    try {
        const company = await Company.find().exec();
        return res.status(200).json(company);
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};

/**
 * @swagger
 * /companies/id:
 *  get:
 *    summary: return A company by id
 *    tags: [Companies]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: '61da409632c8196efc5dd779'
 *    responses:
 *      200:
 *        description:  array of Company Objects should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: '61da409632c8196efc5dd779'
 *              companyName: 'Company A'
 *              abn: '123456789'
 *              logo: http://companya.png'
 *              description: 'Company A description'
 *              industry:
 *                - manufacturing
 *                - diary
 *              isActive: true
 *              employees: []
 *              address: '100 Elizabeth Street, 2000'
 *      '404':
 *        description: Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'sku not found'
 */

const getCompanyById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const companyById = await Company.findById(id);
        if (companyById) {
            res.status(200).json({ message: companyById });
        } else {
            res.status(404).json({ error: `${id} not found!` });
        }
    } catch (error) {
        res.status(400).json((error as Error).message);
    }
};

/**
 * @swagger
 * /companies/id:
 *  put:
 *    tags: [Companies]
 *    summary: update a existing company by id
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *        example: '61da409632c8196efc5dd779'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *            _id: '61da409632c8196efc5dd779'
 *            companyName: 'Company A Update'
 *            abn: '123456789'
 *            description: 'Company A description'
 *            industry:
 *              - manufacturing
 *              - diary
 *            address: '100 Elizabeth Street, 2000'
 *    responses:
 *      '200':
 *        description: OK
 *        content:
 *          application/json:
 *          schema:
 *            type: object
 *          example:
 *            _id: '61da409632c8196efc5dd779'
 *            companyName: 'Company A Update'
 *            abn: '123456789'
 *            description: 'Company A description'
 *            industry:
 *              - manufacturing
 *              - diary
 *            address: '100 Elizabeth Street, 2000'
 *      '400':
 *        description: Failed
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'error message'
 *      '404':
 *        description: Not Found
 *        content:
 *          appplication/json:
 *            schema:
 *              type: object
 *            example: 'id not found'
 */

const updateCompanyById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { companyName, abn, logo, description, industry, employees, address } = req.body;
        if (!companyName && !abn && !logo && !description && !industry && !employees && !address) {
            return res.status(400).json({ message: 'Body contains no update to the Company' });
        }
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).exec();
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        return res.status(200).json({ message: 'Company updated', updatedCompany });
    } catch (error) {
        return res.status(400).json({ message: 'Error updating company', error });
    }
};

const inviteEmployees: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { emails } = req.body as { emails: string[] };
    const { companyId } = req.params as { companyId: string };
    const { userId, role } = res.locals as { userId: string; role: string };
    const {
        NODE_ENV,
        JWT_SECRET,
        APP_URL_LOCAL,
        APP_URL_TEST,
        APP_URL_PRODUCTION,
        EMAIL_USERNAME,
        SENDGRID_API_KEY,
    } = process.env;

    if (
        !NODE_ENV ||
        !JWT_SECRET ||
        !APP_URL_LOCAL ||
        !APP_URL_TEST ||
        !APP_URL_PRODUCTION ||
        !EMAIL_USERNAME ||
        !SENDGRID_API_KEY
    ) {
        return next(new Errors.EnvironmentError('Missing environment variables', 'env'));
    }

    if (!userId || !role) {
        return next(
            new Errors.EnvironmentError(
                'Missing userId or role in res.locals',
                'res.locals.userId or role',
            ),
        );
    }

    const appURLs: {
        [key: string]: string | undefined;
        development: string;
        test: string;
        production: string;
    } = {
        development: APP_URL_LOCAL,
        test: APP_URL_TEST,
        production: APP_URL_PRODUCTION,
    };

    try {
        const user: IUser | null = await User.findById(userId).exec();

        if (!user) {
            throw new Errors.NotFoundError(
                'User not found in the database',
                'user not found in database',
            );
        }

        const existedCompany = await Company.findById(companyId).exec();
        if (!existedCompany) {
            throw new Errors.NotFoundError(
                'Company not found in the database',
                'Company not found',
            );
        }

        if (!user.company || user.company.toString() !== existedCompany._id.toString()) {
            throw new Errors.ValidationError(
                'Company of user does not match the companyId param',
                'companyId param',
            );
        }

        const { companyName } = existedCompany;

        const emailSendingPromises = emails.map(async (email: string) => {
            try {
                const verificationToken = jwt.sign({ email, invitedBy: userId }, JWT_SECRET, {
                    expiresIn: '6h',
                });

                const verificationLink = `${appURLs[NODE_ENV]}/companies/${companyId}/invite-employees/${verificationToken}`;
                const emailContent = emailTemplates.employeeVerification(
                    verificationLink,
                    companyName,
                );

                await sendEmail({
                    to: email,
                    subject: 'Welcome! Please Verify Your Email',
                    html: emailContent,
                });
                return { email, success: true };
            } catch (error) {
                return { email, success: false, error: `Failed tp send to ${email}` };
            }
        });

        const results = await Promise.all(emailSendingPromises);

        const failedEmails = results.filter(result => !result.success);
        const successEmails = results.filter(result => result.success);
        const failedEmailsMessage = failedEmails.map(result => result.email).join(', ');
        const failedEmailAddresses = failedEmails.map(result => result.email);

        // All failures
        if (successEmails.length === 0) {
            throw new Errors.BusinessLogicError(
                `Failed to send verification emails to: ${failedEmailsMessage}`,
            );
        }

        // All success
        if (failedEmails.length === 0) {
            return res.status(200).json({
                message: 'Verification emails have been sent to all employees.',
            });
        }

        // Successes and failures
        return res.status(200).json({
            message:
                'Verification emails have been sent to some of the employees, but some failed as well.',
            failedEmailAddresses,
        });
    } catch (error: unknown) {
        next(error);
    }
};

const AddEmployeeToCompany: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { username, firstName, lastName, password, token } = req.body;
    const { companyId } = req.params;

    const { JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
        return next(new Errors.EnvironmentError('Missing environment variables', 'env'));
    }

    let session: mongoose.ClientSession | null = null;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { email, invitedBy } = validateToken(token) as { email: string; invitedBy: string };

        if (!email || !invitedBy) {
            throw new Errors.ValidationError('Missing email or invitedBy in jwt', 'jwt');
        }

        const existingUser = await User.findOne({ email }, null, { session }).exec();

        if (existingUser) {
            throw new Errors.ValidationError('Email already in use', 'Email');
        }

        const inviter = await User.findById(invitedBy, null, { session }).exec();

        if (!inviter || !inviter.company) {
            throw new Errors.ValidationError(
                'Inviter or company does not exist',
                `${Role.SuperAdmin}`,
            );
        }

        const currentCompany = await Company.findById(companyId, null, { session }).exec();

        if (!currentCompany || !currentCompany.employees) {
            throw new Errors.ValidationError(
                'Company is not exist or have empty employees array',
                'company',
            );
        }

        const partialProperties: Partial<IUser> = {
            username,
            firstName,
            lastName,
            email,
            password,
            role: Role.Employee,
            isAccountComplete: true,
            isActive: true,
            company: currentCompany._id,
            invitedBy: inviter._id,
        };

        const newUser: IUser = new User(partialProperties);
        const savedUser: IUser = await newUser.save({ session });
        const userJson: IUser = savedUser.toJSON();

        currentCompany.employees.push(savedUser._id);

        const updatedCompany: ICompany = await currentCompany.save({ session });
        const companyJson: ICompany = updatedCompany.toJSON();

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: 'Successfully create employee account',
            companyJson,
            userJson,
        });
    } catch (error: unknown) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        next(error);
    }
};

const updateCompany: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { userId, role } = res.locals;
    const { companyId } = req.params;
    const updateData = req.body;

    if (!userId || userId.trim().length === 0 || !role) {
        throw new Errors.NotFoundError('UserId and role not found', 'userId and role');
    }

    try {
        const updateFields: { [key: string]: string } = {};
        Object.keys(updateData).forEach(key => {
            if (updateData[key]) {
                updateFields[key] = updateData[key];
            }
        });

        const updatedCompany: ICompany | null = await Company.findByIdAndUpdate(
            companyId,
            { $set: updateFields },
            { new: true },
        );

        if (!updatedCompany) {
            throw new Errors.DatabaseError(
                'Error when updating company profile',
                'updating company profile',
            );
        }

        const companyJson = updatedCompany.toJSON();
        return res.status(201).json({
            message: 'Successfully update the company profile',
            companyJson,
        });
    } catch (error: unknown) {
        next(error);
    }
};

const getEmployeesFromCompany: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { companyId } = req.params;

    try {
        const company = await Company.findById(companyId).populate('employees').exec();

        const employeesArray = company?.employees;
        return res.status(201).json({
            message: 'Successfully fetch all of employee infos from the company',
            employeesArray,
        });
    } catch (error: unknown) {
        next(error);
    }
};

const promoteEmployee: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const targetUser = res.locals.targetUser as IUser;

    try {
        targetUser.role = Role.Admin;
        const updatedUser: IUser = await targetUser.save();
        const userJson: IUser = updatedUser.toJSON();
        const updatedRole = updatedUser.role;
        return res.status(201).json({
            message: `Successfully promote ${Role.Employee} to ${Role.Admin}`,
            userJson,
            updatedRole,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/*
 * delete function is not implemented as it won't be applicable for companies
 */

export default {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    inviteEmployees,
    AddEmployeeToCompany,
    updateCompany,
    getEmployeesFromCompany,
    promoteEmployee,
};
