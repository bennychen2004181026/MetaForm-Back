import Router from 'express';
import companyControllers from '@controllers/company.controller';
import routeValidators from '@middleware/routeValidators/companies';
import userRouteMiddlewares from '@middleware/usersRoute';
import companyRouteMiddlewares from '@middleware/companyRoute';

const router = Router();
router.get('/', companyControllers.getAllCompanies);
router.get('/:id', companyControllers.getCompanyById);
router.post('/', companyControllers.addCompany);
router.patch('/:id', companyControllers.updateCompanyById);

router.post(
    '/:companyId/invite-employees',
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.emailArrayValidator,
    companyControllers.inviteEmployees,
);

router.post(
    '/:companyId/add-employees',
    routeValidators.addEmployeeValidator,
    companyControllers.AddEmployeeToCompany,
);

router.patch(
    '/:companyId/update-company-profile',
    userRouteMiddlewares.verifyHeaderToken,
    routeValidators.updateCompanyValidator,
    companyControllers.updateCompany,
);

router.get(
    '/:companyId/employees',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyControllers.getEmployeesFromCompany,
);

router.post(
    '/:companyId/users/:userId/promote-employee',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyControllers.promoteEmployee,
);

router.post(
    '/:companyId/users/:userId/demote-employee',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyControllers.demoteAdmin,
);

router.post(
    '/:companyId/users/:userId/deactivate',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyControllers.deactivateUser,
);

router.post(
    '/:companyId/users/:userId/reactivate',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyControllers.reactivateUser,
);

export default router;
