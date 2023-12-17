import Router from 'express';
import {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    inviteEmployees,
} from '@controllers/company.controller';
import routeValidators from '@middleware/routeValidators/companies';
import userRouteMiddlewares from '@middleware/usersRoute';

const router = Router();
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post('/', addCompany);
router.patch('/:id', updateCompanyById);

router.post(
    '/:companyId/invite-employees',
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.emailArrayValidator,
    inviteEmployees,
);

export default router;
