import { Request, RequestHandler, Response } from 'express';
import QuestionModel from '@models/question.model';

const getAllQuestions: RequestHandler = async (req: Request, res: Response) => {
    try {
        const questions = await QuestionModel.find().exec();
        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json((error as Error).message);
    }
};
const getQuestionById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const question = await QuestionModel.findById(id).exec();
        if (!question) {
            res.status(404).json({ error: 'Question not found!' });
            return;
        }
        res.json(question);
    } catch (error) {
        res.status(400).json((error as Error).message);
    }
};

const createQuestion: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { text, type, options, mandatory } = req.body;
        const newQuestion = new QuestionModel({ text, type, options, mandatory });
        await newQuestion.save();
        res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
        res.status(400).json((error as Error).message);
    }
};

const updateQuestionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text, type, options, mandatory } = req.body;
    const question = await QuestionModel.findByIdAndUpdate(
        id,
        { text, type, options, mandatory },
        { new: true },
    ).exec();
    if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
    }
    res.json(question);
};

const deleteQuestionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const question = await QuestionModel.findById(id).exec();
    if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
    }
    res.sendStatus(204);
};
export { getAllQuestions, getQuestionById, createQuestion, updateQuestionById, deleteQuestionById };
