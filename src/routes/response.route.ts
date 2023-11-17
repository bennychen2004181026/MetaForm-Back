import { Router } from 'express';
import {
    createResponse,
    deleteResponseById,
    getResponseById,
    addAnswerToResponse,
    getAllResponsesByFormId,
} from '@controllers/response.controller';

const responseRouter = Router();

responseRouter.get('/:id', getResponseById);
responseRouter.get('/form/:id', getAllResponsesByFormId);
responseRouter.post('/', createResponse);
responseRouter.delete('/:id', deleteResponseById);

responseRouter.patch('/:responseId/answer/:answerId', addAnswerToResponse);

export default responseRouter;
