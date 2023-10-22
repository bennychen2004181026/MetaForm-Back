import Router from 'express';
import companyRouter from './company.route';

const v1Router = Router();
v1Router.use('/companies', companyRouter);

export default v1Router;
