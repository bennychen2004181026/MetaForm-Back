import Router from 'express';
import formRouter from './form.route';
import responseRouter from './response.route';
import companyRouter from './company.route';

const router = Router();
router.use('/companies', companyRouter);
router.use('/forms', formRouter);
router.use('/responses', responseRouter);

export default router;
