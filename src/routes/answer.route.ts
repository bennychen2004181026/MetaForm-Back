import { Router } from 'express';
import { deleteAnswerById, getAnswerById, createAnswer } from '@controllers/answer.controller';

const answerRouter = Router();
answerRouter.get('/:id', getAnswerById);
answerRouter.post('/', createAnswer);
answerRouter.delete('/:id', deleteAnswerById);
export default answerRouter;
