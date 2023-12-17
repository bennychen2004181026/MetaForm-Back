import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import Company from '@models/company.model';
import { ICompany } from '@interfaces/company';
import Errors from '@errors/ClassError';
import { sendEmail, emailTemplates } from '@utils/emailService';

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
    const { NODE_ENV, JWT_SECRET, PORT, EMAIL_USERNAME, SENDGRID_API_KEY } = process.env;

    if (!NODE_ENV || !JWT_SECRET || !PORT || !EMAIL_USERNAME || !SENDGRID_API_KEY) {
        return next(new Errors.EnvironmentError('Missing environment variables', 'env'));
    }

    try {
        const existedCompany = await Company.findById(companyId).exec();
        if (!existedCompany) {
            throw new Errors.NotFoundError(
                'Company not found in the database',
                'Company not found',
            );
        }
        const { companyName } = existedCompany;

        const emailSendingPromises = emails.map(async (email: string) => {
            try {
                const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '6h' });

                let verificationLink: string;
                if (NODE_ENV === 'production') {
                    verificationLink = `http://localhost:${PORT}/companies/${companyId}/inviteEmployees/${verificationToken}`;
                } else if (NODE_ENV === 'test') {
                    verificationLink = `http://localhost:${PORT}/companies/${companyId}/inviteEmployees/${verificationToken}`;
                } else {
                    verificationLink = `http://localhost:${PORT}/companies/${companyId}/inviteEmployees/${verificationToken}`;
                }

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
                return { email, success: false, error };
            }
        });

        const results = await Promise.all(emailSendingPromises);

        const failedEmails = results.filter(result => !result.success);
        if (failedEmails.length > 0) {
            throw new Errors.BusinessLogicError(
                `Failed to send verification emails to: ${failedEmails.join(', ')}`,
            );
        }

        return res.status(200).json({
            message: 'Verification emails have been sent to all employees.',
        });
    } catch (error: unknown) {
        next(error);
    }
};

/*
 * delete function is not implemented as it won't be applicable for companies
 */

export { addCompany, getCompanyById, getAllCompanies, updateCompanyById, inviteEmployees };
