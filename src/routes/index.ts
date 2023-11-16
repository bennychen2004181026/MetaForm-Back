import Router from 'express';
import companyRouter from './company.route';
import formRouter from './form.route';
import questionRouter from './question.route';

const router = Router();
router.use('/companies', companyRouter);
router.use('/forms', formRouter);
router.use('/questions', questionRouter);

export default router;
