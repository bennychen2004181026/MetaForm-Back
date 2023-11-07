import { Request, RequestHandler, Response } from 'express';
import Question from '@models/question.model';

const getAllQuestions: RequestHandler = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find().exec();
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};
const getQuestionById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id).exec();
        if (!question) {
            return res.status(404).json({ error: 'Question not found!' });
        }
        return res.status(200).json(question);
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};

const createQuestion: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { text, type, options, mandatory } = req.body;
        if (!text || !type || !options || !mandatory) {
            return res.status(400).json({ error: 'Please enter all required fields!' });
        }
        const newQuestion = new Question({ text, type, options, mandatory });
        await newQuestion.save();
        return res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};

const updateQuestionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { text, type, options, mandatory } = req.body;
        if (!text || !type || !options || !mandatory) {
            return res.status(400).json({ error: 'Please enter all required fields!' });
        }
        const question = await Question.findByIdAndUpdate(
            id,
            { text, type, options, mandatory },
            { new: true },
        ).exec();
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        return res.json({ message: 'Question updated' });
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};

const deleteQuestionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const question = await Question.findByIdAndDelete(id).exec();
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        return res.status(204).json({ message: 'Question deleted' });
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};
export { getAllQuestions, getQuestionById, createQuestion, updateQuestionById, deleteQuestionById };
