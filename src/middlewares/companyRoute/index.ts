import validateCompanyAndUser from '@middleware/companyRoute/validateCompanyAndUser';
import requiredRoles from '@middleware/companyRoute/requiredRoles';
import requiredTargetRoles from '@middleware/companyRoute/requiredTargetRoles';

export default {
    validateCompanyAndUser,
    requiredRoles,
    requiredTargetRoles,
};
