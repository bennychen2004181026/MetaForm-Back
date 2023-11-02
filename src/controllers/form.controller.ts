import { Request, Response, RequestHandler } from 'express';
import FormResponse from '@models/formResponse.model';
import Question from '@models/question.model';
import NotFoundException from '@middleware/exceptions/NotFoundException';
import Form from '@models/form.model';

const createForm: RequestHandler = async (req: Request, res: Response) => {
    const { title, createdBy, company, validFrom, expire, questions, description } = req.body;
    if (!title || !createdBy || !company || !validFrom || !expire || questions.length === 0) {
        return res.status(400).json({ error: 'Please fill all required fields' });
    }
    const form = new Form({
        title,
        createdBy,
        company,
        validFrom,
        expire,
        description,
        questions,
    });
    await form.save();
    return res.status(201).json(form);
};

const getFormById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const form = await Form.findById(id).exec();
    if (!form) {
        throw new NotFoundException(`Form ${id} is not found`);
    }
    return res.json(form);
};

const updateFormById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, validFrom, expire, description, questions } = req.body;
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
    res.json(form);
};
const deleteFormById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
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
    return res.json(form);
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
    return res.json(form);
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
