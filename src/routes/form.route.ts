import { Router } from 'express';
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
} from '@controllers/form.controller';

const formRouter = Router();

formRouter.get('/:id', getFormById);
formRouter.get('/user/:userId', getAllFormsByUserId);

formRouter.post('/', createForm);
formRouter.post('/:formId/questions/:questionId', addQuestionToForm);
formRouter.post('/:formId/responses/:responseId', addResponseToForm);

formRouter.patch('/:id', updateFormById);

formRouter.delete('/:formId/questions/:questionId', deleteQuestionFromForm);
formRouter.delete('/:formId/responses/:responseId', deleteResponseFromForm);
formRouter.delete('/:id', deleteFormById);

export default formRouter;
