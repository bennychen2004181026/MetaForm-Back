import Router from 'express';
import userRouter from '@routes/user.route'
import companyRouter from './company.route';
import formRouter from './form.route';
import questionRouter from './question.route';
import responseRouter from './response.route';

const router = Router();
router.use('/companies', companyRouter);
router.use('/forms', formRouter);
router.use('/questions', questionRouter);
router.use('/users', userRouter);
router.use('/responses', responseRouter);

export default router;
