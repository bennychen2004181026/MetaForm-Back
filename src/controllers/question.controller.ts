import { Request, RequestHandler, Response } from 'express';
import Question, { questionTypes } from '@models/question.model';

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
    const { question } = req.body;
    const { questionTitle, questionType, required, options, acceptFileTypes, numOfFiles } =
        question;
    try {
        if (!questionTitle || !questionType || required === undefined) {
            return res.status(400).json({ error: 'Please enter all required fields!' });
        }
        if (questionType === questionTypes.FILE_UPLOAD) {
            if (!acceptFileTypes || !numOfFiles) {
                return res.status(400).json({
                    error: 'You have not selected the expected file types or number of files for file-upload questions!',
                });
            }
        }
        const newQuestion = new Question({
            questionTitle,
            questionType,
            required,
            options,
            acceptFileTypes,
            numOfFiles,
        });
        await newQuestion.save();
        return res.status(201).json({
            message: 'Question created successfully',
            createdQuestion: newQuestion,
        });
    } catch (error) {
        return res.status(400).json((error as Error).message);
    }
};

const updateQuestionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { text, type, options } = req.body;
        if (!text || !type || !options) {
            return res.status(400).json({ error: 'Please enter all required fields!' });
        }
        const question = await Question.findByIdAndUpdate(
            id,
            { text, type, options },
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
