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
import {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestionById,
    deleteQuestionById,
} from './question.controller';

export default {
    addCompany,
    getCompanyById,
    getAllCompanies,
    updateCompanyById,
    deleteCompanyById,
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestionById,
    deleteQuestionById,
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
