import Router from 'express';
import companyRouter from './company.route';
<<<<<<< HEAD
import questionRouter from './question.route';

const v1Router = Router();
v1Router.use('/companies', companyRouter);
v1Router.use('/questions', questionRouter);
=======
import formRouter from './form.route';

const router = Router();
router.use('/companies', companyRouter);
router.use('/forms', formRouter);
>>>>>>> 787684725526852e75579fb5c796ffb5ccb5ae8e

export default router;
