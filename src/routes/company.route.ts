import Router from 'express';
import {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    inviteEmployees,
    AddEmployeeToCompany,
    updateCompany,
    getEmployeesFromCompany,
} from '@controllers/company.controller';
import routeValidators from '@middleware/routeValidators/companies';
import userRouteMiddlewares from '@middleware/usersRoute';
import companyRouteMiddlewares from '@middleware/companyRoute';

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

router.post(
    '/:companyId/add-employees',
    routeValidators.addEmployeeValidator,
    AddEmployeeToCompany,
);

router.patch(
    '/:companyId/update-company-profile',
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.updateCompanyValidator,
    updateCompany,
);

router.get(
    '/:companyId/get-all-employees',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    getEmployeesFromCompany,
);

export default router;
