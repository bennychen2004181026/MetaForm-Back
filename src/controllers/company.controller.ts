import { Request, Response, RequestHandler } from 'express';
import Company from '../models/company.model';
import { ICompany } from '../interfaces/company';

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
      res.status(400).json({ error: 'Company abn already exists' });
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
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }
    return res.status(200).json({ message: 'Company updated', updatedCompany });
  }
  catch (error) {
    return res.status(400).json({ message: 'Error updating company', error });
  }
};

/**
 * @swagger
 * /companies/{id}:
 *  delete:
 *    summary: return removed company by id
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
 *        description:  Deleted company should be returned
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              _id: '61da409632c8196efc5dd779'
 *              companyName: 'Company A Update'
 *              abn: '123456789'
 *              description: 'Company A description'
 *              industry: 
 *                - manufacturing
 *                - diary
 *              address: '100 Elizabeth Street, 2000'
 *              _v: 0
 *      404:
 *        description: company not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              error: 'sku not found.'
 */

const deleteCompanyById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id).exec();
    if (!company) {
      res.status(404).json({ error: `${id} not found!` });
    } else {
      res.status(200).json({ message: 'Deleted successfully' });
    }
    
  } catch (error) {
    res.status(400).json((error as Error).message);
  }
};

export { addCompany, getCompanyById, getAllCompanies, updateCompanyById, deleteCompanyById };
