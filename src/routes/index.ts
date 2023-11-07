import Router from 'express';
import companyRouter from './company.route';
import formRouter from './form.route';

const router = Router();
router.use('/companies', companyRouter);
router.use('/forms', formRouter);

export default router;
