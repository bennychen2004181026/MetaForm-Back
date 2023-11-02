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
    staffController,
    userController,
    authController,
};
