import Router from 'express';
import {
  addCompany,
  getCompanyById,
  getAllCompanies,
  updateCompanyById,
} from '@controllers/company.controller';

const router = Router();
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post('/', addCompany);
router.patch('/:id', updateCompanyById);
export default router;