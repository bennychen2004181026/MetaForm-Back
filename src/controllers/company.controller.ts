import { Request, Response, RequestHandler } from 'express';

const addCompany = async (req: Request, res: Response) => {
  res.send('Add one company');
};
const getCompanyById: RequestHandler = async (req: Request, res: Response) => {
  res.send('Get company by Id');
};
const getAllCompanies: RequestHandler = async (req: Request, res: Response) => {
  res.send('All companies');
};
const updateCompanyById: RequestHandler = async (req: Request, res: Response) => {
  res.send('Update company by Id');
};
const deleteCompanyById: RequestHandler = async (req: Request, res: Response) => {
  res.send('Delete company by Id');
};

export { addCompany, getCompanyById, getAllCompanies, updateCompanyById, deleteCompanyById };
