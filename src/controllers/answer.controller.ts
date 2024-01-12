import { Request, Response, RequestHandler, NextFunction } from 'express';
import Answer from '@models/answer.model';
import NotFoundException from '@middleware/exceptions/NotFoundException';

const createAnswer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { questionId, answerBody } = req.body;
    if (!questionId) {
        return res.status(400).json({ error: 'Please provide the corresponding question Id' });
    }
    if (!Array.isArray(answerBody) || answerBody.length === 0) {
        return res.status(400).json({ error: 'The answer is empty' });
    }
    try {
        const newAnswer = new Answer({
            questionId,
            answerBody,
        });
        await newAnswer.save();
        return res.status(201).json(newAnswer);
    } catch (err) {
        next(err);
    }
};

const getAnswerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Please provide response id' });
    }
    const formResponse = await Answer.findById(id).exec();
    if (!formResponse) {
        throw new NotFoundException(`response ${id} not found`);
    }
    return res.status(200).json(formResponse);
};
const deleteAnswerById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ error: 'Please provide a formId to be deleted' });
    }
    await Answer.findById({ _id: id });
    return res.status(204).json({ msg: `Answer ${id} deleted` });
};
export { deleteAnswerById, getAnswerById, createAnswer };
