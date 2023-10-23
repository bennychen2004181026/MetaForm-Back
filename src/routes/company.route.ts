import Router from 'express';

import {
  addCompany,
  getCompanyById,
  getAllCompanies,
  updateCompanyById,
  deleteCompanyById,
} from '../controllers/company.controller';

const companyRouter = Router();

companyRouter.get('/', getAllCompanies);
companyRouter.get('/:id', getCompanyById);
companyRouter.post('/', addCompany);
companyRouter.patch('/:id', updateCompanyById);
companyRouter.delete('/:id', deleteCompanyById);

export default companyRouter;
