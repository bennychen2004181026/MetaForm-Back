import {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    deleteCompanyById,
} from './company.controller';
import staffController from './staff.controller';
import authController from './auth.controller';
import userController from './user.controller';

export default {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    deleteCompanyById,
    staffController,
    userController,
    authController,
};
