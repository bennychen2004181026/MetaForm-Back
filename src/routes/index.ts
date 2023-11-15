import Router from 'express';
import companyRouter from './company.route';
import questionRouter from './question.route';

const v1Router = Router();
v1Router.use('/companies', companyRouter);
v1Router.use('/questions', questionRouter);
import formRouter from './form.route';

const router = Router();
router.use('/companies', companyRouter);
router.use('/forms', formRouter);

export default router;
