import { Request, Response, RequestHandler, NextFunction } from 'express';
import FormResponse from '@models/formResponse.model';
import NotFoundException from '@middleware/exceptions/NotFoundException';
import Answer from '@models/answer.model';

const createResponse: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { formId, answers } = req.body;
    if (!formId) {
        return res.status(400).json({ error: 'Please provide the corresponding formId' });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ error: 'The response is empty' });
    }
    const newForm = new FormResponse({
        formId,
        answers,
    });
    await newForm.save();
    return res.status(201).json(newForm);
};

const deleteResponseById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(404).json({ error: 'Please provide a responseId to be deleted' });
    }
    const formResponse = await FormResponse.findById(id);
    if (!formResponse) {
        throw new NotFoundException(`form ${id} is not found`);
    }
    const { answers } = formResponse;
    await Answer.deleteMany({ _id: { $in: answers } });
    await FormResponse.deleteOne({ _id: formResponse._id }).exec();
    return res.status(204).json({ msg: 'Response is deleted successfully' });
};

const getResponseById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Please provide response id' });
    }
    const formResponse = await FormResponse.findById(id).exec();
    if (!formResponse) {
        throw new NotFoundException(`response ${id} is not found`);
    }
    return res.status(200).json(formResponse);
};

const addAnswerToResponse: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { responseId, answerId } = req.params;
    if (!responseId || !answerId) {
        return res.status(404).json({ message: 'Provide both response Id and answer Id' });
    }
    const answer = await Answer.findById(answerId).exec();
    if (!answer) {
        throw new NotFoundException(`Answer ${answerId} is not found`);
    }
    const response = await FormResponse.findByIdAndUpdate(responseId, {
        $addToSet: { answers: answerId },
    });
    return res.status(200).json(response);
};

export { createResponse, deleteResponseById, getResponseById, addAnswerToResponse };
