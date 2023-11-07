import Router from 'express';
import formRouter from './form.route';
import responseRouter from './response.route';

const router = Router();
router.use('/forms', formRouter);
router.use('/responses', responseRouter);

export default router;
