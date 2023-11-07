import { Request, Response, RequestHandler, NextFunction } from 'express';
import FormResponse from '@models/formResponse.model';
import Question from '@models/question.model';
import NotFoundException from '@middleware/exceptions/NotFoundException';
import Form from '@models/form.model';

const createForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { title, createdBy, validFrom, expire, questions, description } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Please provide at least 1 question' });
    }
    const newForm = new Form({
        title,
        createdBy,
        validFrom,
        expire,
        description,
        questions,
    });
    await newForm.save();
    return res.status(201).json(newForm);
};

const getFormById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Please provide form id' });
    }
    const form = await Form.findById(id).exec();
    if (!form) {
        throw new NotFoundException(`Form ${id} is not found`);
    }
    return res.status(200).json(form);
};

const updateFormById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'Please provide form id' });
    }
    const { title, validFrom, expire, description, questions } = req.body;
    if (!title || !validFrom || !expire) {
        return res.status(400).json({ error: 'Please fill all required fields' });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Please provide at least 1 question' });
    }
    const form = await Form.findByIdAndUpdate(
        id,
        {
            title,
            validFrom,
            expire,
            description,
            questions,
        },
        { new: true },
    ).exec();
    if (!form) {
        throw new NotFoundException(`form ${id} is not found`);
    }
    res.status(200).json(form);
};
const deleteFormById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ error: 'Please provide a formId to be deleted' });
    }
    const form = await Form.findById(id);
    if (!form) {
        throw new NotFoundException(`form ${id} is not found`);
    }
    const { responses, questions } = form;
    await FormResponse.deleteMany({ _id: { $in: responses } });
    await Question.deleteMany({ _id: { $in: questions } });
    await Form.deleteOne({ _id: form._id }).exec();
    return res.status(204).json({ msg: 'Form is deleted successfully' });
};

const addQuestionToForm: RequestHandler = async (req: Request, res: Response) => {
    const { formId, questionId } = req.params;
    if (!formId || !questionId) {
        return res.status(404).json({ message: 'Provide both form Id and response Id' });
    }
    const question = await Question.findById(questionId).exec();
    if (!question) {
        throw new NotFoundException(`Question ${questionId} is not found`);
    }
    const form = await Form.findByIdAndUpdate(formId, { $addToSet: { questions: questionId } });
    return res.status(200).json(form);
};

const deleteQuestionFromForm: RequestHandler = async (req: Request, res: Response) => {
    const { formId, questionId } = req.params;
    if (!formId || !questionId) {
        return res.status(404).json({ message: 'Provide both form Id and response Id' });
    }
    const question = await Question.findById(questionId).exec();
    if (!question) {
        throw new NotFoundException(`Question ${questionId} is not found`);
    }
    const form = await Form.findByIdAndUpdate(formId, {
        $pull: { questions: questionId },
    });
    return res.status(200).json(form);
};

const addResponseToForm: RequestHandler = async (req: Request, res: Response) => {
    const { formId, responseId } = req.params;
    if (!formId || !responseId) {
        return res.status(404).json({ message: 'Both Form Id and response Id are required' });
    }
    const formResponse = await FormResponse.findById(responseId).exec();
    if (!formResponse) {
        throw new NotFoundException(`Response ${responseId} is not found`);
    }
    const form = await Form.findByIdAndUpdate(formId, {
        $pull: { responses: responseId },
    }).exec();

    return res.status(204).json(form);
};

const deleteResponseFromForm: RequestHandler = async (req: Request, res: Response) => {
    const { formId, responseId } = req.params;
    if (!formId || !responseId) {
        return res.status(404).json({ message: 'Both Form Id and response Id are required' });
    }
    const formResponse = await FormResponse.findById(responseId).exec();
    if (!formResponse) {
        throw new NotFoundException(`Response ${responseId} is not found`);
    }
    const form = await Form.findByIdAndUpdate(formId, {
        $pull: { responses: responseId },
    }).exec();

    return res.status(204).json(form);
};
const getAllFormsByUserId: RequestHandler = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(404).json({ message: 'Provide user id' });
    }
    const userForms = await Form.find({ createdBy: userId }).exec();
    return res.status(200).json(userForms);
};

export {
    createForm,
    getFormById,
    updateFormById,
    deleteFormById,
    addResponseToForm,
    addQuestionToForm,
    deleteQuestionFromForm,
    deleteResponseFromForm,
    getAllFormsByUserId,
};
