import Router from 'express';
import {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestionById,
    deleteQuestionById,
} from '@controllers/question.controller';
const questionRouter = Router();
questionRouter.get('/', getAllQuestions);
questionRouter.get('/:id', getQuestionById);
questionRouter.post('/', createQuestion);
questionRouter.put('/:id', updateQuestionById);
questionRouter.delete('/:id', deleteQuestionById);
export default questionRouter;
