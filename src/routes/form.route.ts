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
formRouter.post('/', createForm);
formRouter.get('/:id', getFormById);
formRouter.patch('/:id', updateFormById);
formRouter.delete('/:id', deleteFormById);
formRouter.get('/userForms/:userId', getAllFormsByUserId);
formRouter.post('/:formId/questions/:questionId', addQuestionToForm);
formRouter.post('/:formId/responses/:responseId', addResponseToForm);
formRouter.delete('/:studentId/questions/:questionId', deleteQuestionFromForm);
formRouter.delete('/:formId/responses/:responseId', deleteResponseFromForm);

export default formRouter;
