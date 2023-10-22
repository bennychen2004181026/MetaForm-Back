import Router from 'express';

import {
  addCompany,
  getCompanyById,
  getAllCompanies,
  updateCompanyById,
  deleteCompanyById,
} from '../controllers/company.controller';

const companyRouter = Router();

companyRouter.get('/', addCompany);
companyRouter.get('/:id', getCompanyById);
companyRouter.post('/', getAllCompanies);
companyRouter.patch('/:id', updateCompanyById);
companyRouter.delete('/:id', deleteCompanyById);

export default companyRouter;
