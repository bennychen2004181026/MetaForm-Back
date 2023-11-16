import {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    deleteCompanyById,
} from './company.controller';
import {
    createForm,
    getFormById,
    updateFormById,
    deleteFormById,
    addResponseToForm,
    addQuestionToForm,
    deleteQuestionFromForm,
    deleteResponseFromForm,
    getAllFormsByUserId,
} from './form.controller';
import authController from './auth.controller';
import userController from './user.controller';

export default {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    deleteCompanyById,
    createForm,
    getFormById,
    updateFormById,
    deleteFormById,
    addResponseToForm,
    addQuestionToForm,
    deleteQuestionFromForm,
    deleteResponseFromForm,
    getAllFormsByUserId,
    userController,
    authController,
};
