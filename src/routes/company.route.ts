import Router from 'express';
import companyControllers from '@controllers/company.controller';
import routeValidators from '@middleware/routeValidators/companies';
import userRouteMiddlewares from '@middleware/usersRoute';
import companyRouteMiddlewares from '@middleware/companyRoute';
import { Role } from '@interfaces/userEnum';

const router = Router();
router.get('/', companyControllers.getAllCompanies);
router.get('/:id', companyControllers.getCompanyById);
router.post('/', companyControllers.addCompany);
router.patch('/:id', companyControllers.updateCompanyById);

router.post(
    '/:companyId/invite-employees',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin, Role.Admin]),
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
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin]),
    routeValidators.updateCompanyValidator,
    companyControllers.updateCompany,
);

router.get(
    '/:companyId/employees',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin, Role.Admin]),
    companyControllers.getEmployeesFromCompany,
);

router.post(
    '/:companyId/users/:userId/promote-employee',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin]),
    companyRouteMiddlewares.requiredTargetRoles([Role.Employee]),
    companyControllers.promoteEmployee,
);

router.post(
    '/:companyId/users/:userId/demote-admin',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin]),
    companyRouteMiddlewares.requiredTargetRoles([Role.Admin]),
    companyControllers.demoteAdmin,
);

router.post(
    '/:companyId/users/:userId/deactivate',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin, Role.Admin]),
    companyControllers.deactivateUser,
);

router.post(
    '/:companyId/users/:userId/reactivate',
    userRouteMiddlewares.verifyHeaderToken,
    companyRouteMiddlewares.validateCompanyAndUser,
    companyRouteMiddlewares.requiredRoles([Role.SuperAdmin, Role.Admin]),
    companyControllers.reactivateUser,
);

export default router;
