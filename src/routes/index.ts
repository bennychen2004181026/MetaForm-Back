import Router, { Response, Request } from 'express';
import userRouter from '@routes/user.route';
import companyRouter from './company.route';
import formRouter from './form.route';
import questionRouter from './question.route';
import responseRouter from './response.route';
import answerRouter from './answer.route';

const router = Router();
const healthCheckPath = '/health';

router.get(healthCheckPath, (req: Request, res: Response) => {
    res.status(200).send('APIs OK');
});
router.use('/companies', companyRouter);
router.use('/forms', formRouter);
router.use('/questions', questionRouter);
router.use('/users', userRouter);
router.use('/responses', responseRouter);
router.use('/answers', answerRouter);

export default router;
