import { Router } from 'express';
import {
    createResponse,
    deleteResponseById,
    getResponseById,
    addAnswerToResponse,
} from '@controllers/response.controller';

const responseRouter = Router();
responseRouter.post('/', createResponse);
responseRouter.get('/:id', getResponseById);
responseRouter.delete('/:id', deleteResponseById);

responseRouter.patch('/:formId/questions/:questionId', addAnswerToResponse);

export default responseRouter;
